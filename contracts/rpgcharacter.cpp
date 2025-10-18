#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/system.hpp>
#include <eosio/singleton.hpp>
#include <eosio/crypto.hpp>
#include <eosio/transaction.hpp>

using namespace eosio;

CONTRACT rpgcharacter : public contract {
public:
    using contract::contract;

    // D&D Character classes
    enum character_class : uint8_t {
        BARBARIAN = 0,
        BARD = 1,
        CLERIC = 2,
        DRUID = 3,
        FIGHTER = 4,
        MONK = 5,
        PALADIN = 6,
        RANGER = 7,
        ROGUE = 8,
        SORCERER = 9,
        WARLOCK = 10,
        WIZARD = 11
    };

    // D&D Races
    enum race : uint8_t {
        HUMAN = 0,
        ELF = 1,
        DWARF = 2,
        HALFLING = 3,
        DRAGONBORN = 4,
        GNOME = 5,
        HALF_ELF = 6,
        HALF_ORC = 7,
        TIEFLING = 8
    };

    // Rarity levels (determines starting stats quality)
    enum rarity : uint8_t {
        COMMON = 0,      // Standard array
        UNCOMMON = 1,    // +1 to all stats
        RARE = 2,        // +2 to all stats
        EPIC = 3,        // +3 to all stats
        LEGENDARY = 4    // +4 to all stats, extra proficiencies
    };

    // D&D 5e Stats structure
    struct stats {
        uint8_t strength;       // STR - melee attacks, athletics
        uint8_t dexterity;      // DEX - AC, ranged attacks, stealth
        uint8_t constitution;   // CON - hit points
        uint8_t intelligence;   // INT - knowledge, investigation
        uint8_t wisdom;         // WIS - perception, insight
        uint8_t charisma;       // CHA - persuasion, deception
    };

    // Combat stats
    struct combat_stats {
        uint16_t max_hp;
        uint16_t current_hp;
        uint8_t armor_class;
        uint8_t proficiency_bonus;
        int8_t initiative_bonus;
    };

    // Main characters table
    TABLE character {
        uint64_t        id;
        name            owner;
        std::string     name;
        uint8_t         char_class;
        uint8_t         char_race;
        uint8_t         rarity_level;
        uint8_t         level;
        uint32_t        experience;
        stats           ability_scores;
        combat_stats    combat;
        uint32_t        wins;
        uint32_t        losses;
        uint64_t        equipped_weapon;
        uint64_t        equipped_armor;
        uint64_t        created_at;

        uint64_t primary_key() const { return id; }
        uint64_t by_owner() const { return owner.value; }
        uint64_t by_level() const { return level; }
    };

    // Equipment table (D&D weapons and armor)
    TABLE equipment {
        uint64_t        id;
        name            owner;
        std::string     name;
        uint8_t         equip_type;     // 0=weapon, 1=light armor, 2=medium armor, 3=heavy armor
        uint8_t         rarity_level;
        uint8_t         damage_die;     // d4=4, d6=6, d8=8, d10=10, d12=12
        uint8_t         num_dice;       // number of dice to roll
        int8_t          attack_bonus;
        int8_t          ac_bonus;
        stats           stat_bonuses;
        uint64_t        equipped_to;    // character id

        uint64_t primary_key() const { return id; }
        uint64_t by_owner() const { return owner.value; }
    };

    // Config table for global settings
    TABLE config {
        uint64_t        next_character_id;
        uint64_t        next_equipment_id;
        uint64_t        mint_price;
    };

    typedef eosio::multi_index<"characters"_n, character,
        indexed_by<"byowner"_n, const_mem_fun<character, uint64_t, &character::by_owner>>,
        indexed_by<"bylevel"_n, const_mem_fun<character, uint64_t, &character::by_level>>
    > characters_table;

    typedef eosio::multi_index<"equipment"_n, equipment,
        indexed_by<"byowner"_n, const_mem_fun<equipment, uint64_t, &equipment::by_owner>>
    > equipment_table;

    typedef eosio::singleton<"config"_n, config> config_singleton;

    // Actions
    ACTION init() {
        require_auth(get_self());

        config_singleton config_store(get_self(), get_self().value);
        config cfg;
        cfg.next_character_id = 1;
        cfg.next_equipment_id = 1;
        cfg.mint_price = 1000000; // 1 WAX in 8 decimals
        config_store.set(cfg, get_self());
    }

    ACTION mintchar(name owner, std::string char_name, uint8_t char_class, uint8_t char_race, uint8_t rarity_level) {
        require_auth(owner);

        check(char_name.length() <= 32, "Character name too long");
        check(char_class <= 11, "Invalid character class");
        check(char_race <= 8, "Invalid race");
        check(rarity_level <= 4, "Invalid rarity level");

        config_singleton config_store(get_self(), get_self().value);
        auto cfg = config_store.get();

        characters_table characters(get_self(), get_self().value);

        // Generate D&D ability scores
        stats abilities = generate_dnd_stats(char_class, char_race, rarity_level);

        // Calculate initial combat stats
        combat_stats combat = calculate_combat_stats(abilities, char_class, 1);

        characters.emplace(owner, [&](auto& row) {
            row.id = cfg.next_character_id;
            row.owner = owner;
            row.name = char_name;
            row.char_class = char_class;
            row.char_race = char_race;
            row.rarity_level = rarity_level;
            row.level = 1;
            row.experience = 0;
            row.ability_scores = abilities;
            row.combat = combat;
            row.wins = 0;
            row.losses = 0;
            row.equipped_weapon = 0;
            row.equipped_armor = 0;
            row.created_at = current_time_point().sec_since_epoch();
        });

        cfg.next_character_id++;
        config_store.set(cfg, get_self());
    }

    ACTION gainexp(uint64_t character_id, uint32_t exp_amount) {
        characters_table characters(get_self(), get_self().value);
        auto char_itr = characters.find(character_id);
        check(char_itr != characters.end(), "Character not found");

        require_auth(char_itr->owner);

        characters.modify(char_itr, char_itr->owner, [&](auto& row) {
            row.experience += exp_amount;

            // D&D 5e XP thresholds (simplified)
            uint32_t xp_needed = get_xp_for_level(row.level + 1);

            while(row.experience >= xp_needed && row.level < 20) {
                row.level++;

                // Increase proficiency bonus every 4 levels
                if(row.level % 4 == 1) {
                    row.combat.proficiency_bonus++;
                }

                // Increase HP based on class hit die
                uint8_t hit_die = get_hit_die(row.char_class);
                uint8_t con_modifier = get_ability_modifier(row.ability_scores.constitution);
                row.combat.max_hp += (hit_die / 2 + 1) + con_modifier; // average roll
                row.combat.current_hp = row.combat.max_hp;

                // Check for ability score improvement (ASI) at levels 4, 8, 12, 16, 19
                if(row.level == 4 || row.level == 8 || row.level == 12 || row.level == 16 || row.level == 19) {
                    apply_ability_score_improvement(row);
                }

                xp_needed = get_xp_for_level(row.level + 1);
            }

            // Recalculate combat stats
            row.combat = calculate_combat_stats(row.ability_scores, row.char_class, row.level);
        });
    }

    ACTION battle(uint64_t attacker_id, uint64_t defender_id) {
        characters_table characters(get_self(), get_self().value);

        auto attacker = characters.find(attacker_id);
        auto defender = characters.find(defender_id);

        check(attacker != characters.end(), "Attacker not found");
        check(defender != characters.end(), "Defender not found");
        check(attacker->owner != defender->owner, "Cannot battle your own character");

        require_auth(attacker->owner);

        // D&D combat simulation
        int16_t attacker_hp = attacker->combat.current_hp;
        int16_t defender_hp = defender->combat.current_hp;

        // Simple turn-based combat (3 rounds)
        for(int round = 0; round < 3; round++) {
            // Attacker's turn
            if(attack_roll(attacker->ability_scores, defender->combat.armor_class)) {
                uint16_t damage = calculate_damage(*attacker);
                defender_hp -= damage;
                if(defender_hp <= 0) break;
            }

            // Defender's counter-attack
            if(attack_roll(defender->ability_scores, attacker->combat.armor_class)) {
                uint16_t damage = calculate_damage(*defender);
                attacker_hp -= damage;
                if(attacker_hp <= 0) break;
            }
        }

        bool attacker_wins = attacker_hp > defender_hp;

        if(attacker_wins) {
            characters.modify(attacker, attacker->owner, [&](auto& row) {
                row.wins++;
            });
            characters.modify(defender, same_payer, [&](auto& row) {
                row.losses++;
            });

            // Winner gets XP based on defender's level (D&D XP calculation)
            uint32_t xp_reward = 50 * defender->level;
            gainexp(attacker_id, xp_reward);
        } else {
            characters.modify(attacker, attacker->owner, [&](auto& row) {
                row.losses++;
            });
            characters.modify(defender, same_payer, [&](auto& row) {
                row.wins++;
            });
        }
    }

    ACTION equip(uint64_t character_id, uint64_t equipment_id) {
        characters_table characters(get_self(), get_self().value);
        equipment_table equipments(get_self(), get_self().value);

        auto char_itr = characters.find(character_id);
        auto equip_itr = equipments.find(equipment_id);

        check(char_itr != characters.end(), "Character not found");
        check(equip_itr != equipments.end(), "Equipment not found");
        check(char_itr->owner == equip_itr->owner, "Equipment owner mismatch");

        require_auth(char_itr->owner);

        characters.modify(char_itr, char_itr->owner, [&](auto& row) {
            if(equip_itr->equip_type == 0) {
                row.equipped_weapon = equipment_id;
            } else {
                row.equipped_armor = equipment_id;
            }

            // Recalculate combat stats with equipment
            row.combat = calculate_combat_stats(row.ability_scores, row.char_class, row.level);
        });

        equipments.modify(equip_itr, same_payer, [&](auto& row) {
            row.equipped_to = character_id;
        });
    }

    ACTION rest(uint64_t character_id) {
        characters_table characters(get_self(), get_self().value);
        auto char_itr = characters.find(character_id);
        check(char_itr != characters.end(), "Character not found");

        require_auth(char_itr->owner);

        characters.modify(char_itr, char_itr->owner, [&](auto& row) {
            row.combat.current_hp = row.combat.max_hp; // Long rest - restore all HP
        });
    }

private:
    // D&D 5e standard array: 15, 14, 13, 12, 10, 8
    stats generate_dnd_stats(uint8_t char_class, uint8_t char_race, uint8_t rarity_level) {
        stats base = {15, 14, 13, 12, 10, 8};

        // Apply rarity bonuses
        uint8_t bonus = rarity_level; // Common=0, Uncommon=+1, etc.
        base.strength += bonus;
        base.dexterity += bonus;
        base.constitution += bonus;
        base.intelligence += bonus;
        base.wisdom += bonus;
        base.charisma += bonus;

        // Apply race bonuses (D&D 5e)
        switch(char_race) {
            case HUMAN:
                base.strength++; base.dexterity++; base.constitution++;
                base.intelligence++; base.wisdom++; base.charisma++;
                break;
            case ELF:
                base.dexterity += 2;
                break;
            case DWARF:
                base.constitution += 2;
                break;
            case HALFLING:
                base.dexterity += 2;
                break;
            case DRAGONBORN:
                base.strength += 2; base.charisma++;
                break;
            case GNOME:
                base.intelligence += 2;
                break;
            case HALF_ELF:
                base.charisma += 2; base.dexterity++; base.constitution++;
                break;
            case HALF_ORC:
                base.strength += 2; base.constitution++;
                break;
            case TIEFLING:
                base.charisma += 2; base.intelligence++;
                break;
        }

        // Optimize stats for class (put highest in primary stat)
        base = optimize_for_class(base, char_class);

        return base;
    }

    stats optimize_for_class(stats s, uint8_t char_class) {
        // Ensure primary stat gets highest value
        uint8_t values[6] = {s.strength, s.dexterity, s.constitution, s.intelligence, s.wisdom, s.charisma};

        // Sort values
        for(int i = 0; i < 5; i++) {
            for(int j = i + 1; j < 6; j++) {
                if(values[j] > values[i]) {
                    uint8_t temp = values[i];
                    values[i] = values[j];
                    values[j] = temp;
                }
            }
        }

        // Assign based on class priorities
        stats result;
        switch(char_class) {
            case BARBARIAN: case FIGHTER: case PALADIN:
                result.strength = values[0];
                result.constitution = values[1];
                result.dexterity = values[2];
                result.wisdom = values[3];
                result.charisma = values[4];
                result.intelligence = values[5];
                break;
            case ROGUE: case RANGER: case MONK:
                result.dexterity = values[0];
                result.wisdom = values[1];
                result.constitution = values[2];
                result.intelligence = values[3];
                result.charisma = values[4];
                result.strength = values[5];
                break;
            case WIZARD: case SORCERER:
                result.intelligence = values[0];
                result.dexterity = values[1];
                result.constitution = values[2];
                result.wisdom = values[3];
                result.charisma = values[4];
                result.strength = values[5];
                break;
            case CLERIC: case DRUID:
                result.wisdom = values[0];
                result.constitution = values[1];
                result.strength = values[2];
                result.dexterity = values[3];
                result.intelligence = values[4];
                result.charisma = values[5];
                break;
            case BARD: case WARLOCK:
                result.charisma = values[0];
                result.dexterity = values[1];
                result.constitution = values[2];
                result.wisdom = values[3];
                result.intelligence = values[4];
                result.strength = values[5];
                break;
        }
        return result;
    }

    int8_t get_ability_modifier(uint8_t score) {
        return (score - 10) / 2;
    }

    uint8_t get_hit_die(uint8_t char_class) {
        switch(char_class) {
            case BARBARIAN: return 12;
            case FIGHTER: case PALADIN: case RANGER: return 10;
            case BARD: case CLERIC: case DRUID: case MONK: case ROGUE: case WARLOCK: return 8;
            case SORCERER: case WIZARD: return 6;
            default: return 8;
        }
    }

    combat_stats calculate_combat_stats(stats abilities, uint8_t char_class, uint8_t level) {
        combat_stats cs;

        // Proficiency bonus (D&D 5e)
        cs.proficiency_bonus = 2 + ((level - 1) / 4);

        // Hit Points
        uint8_t hit_die = get_hit_die(char_class);
        uint8_t con_mod = get_ability_modifier(abilities.constitution);
        cs.max_hp = hit_die + con_mod + ((level - 1) * ((hit_die / 2 + 1) + con_mod));
        cs.current_hp = cs.max_hp;

        // Base AC (10 + DEX modifier, can be improved with armor)
        cs.armor_class = 10 + get_ability_modifier(abilities.dexterity);

        // Initiative
        cs.initiative_bonus = get_ability_modifier(abilities.dexterity);

        return cs;
    }

    uint32_t get_xp_for_level(uint8_t level) {
        // D&D 5e XP thresholds (simplified)
        uint32_t xp_table[21] = {
            0, 0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000,
            64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000
        };
        return (level <= 20) ? xp_table[level] : 355000;
    }

    void apply_ability_score_improvement(character& char_data) {
        // ASI: +2 to one stat or +1 to two stats
        // For simplicity, boost the primary stat
        switch(char_data.char_class) {
            case BARBARIAN: case FIGHTER: case PALADIN:
                char_data.ability_scores.strength += 2;
                break;
            case ROGUE: case RANGER: case MONK:
                char_data.ability_scores.dexterity += 2;
                break;
            case WIZARD:
                char_data.ability_scores.intelligence += 2;
                break;
            case CLERIC: case DRUID:
                char_data.ability_scores.wisdom += 2;
                break;
            case BARD: case WARLOCK: case SORCERER:
                char_data.ability_scores.charisma += 2;
                break;
        }
    }

    bool attack_roll(stats attacker_stats, uint8_t target_ac) {
        // d20 roll simulation (using block hash for randomness)
        uint64_t random = get_random();
        uint8_t d20 = (random % 20) + 1;

        // Natural 20 always hits
        if(d20 == 20) return true;
        // Natural 1 always misses
        if(d20 == 1) return false;

        // Attack bonus (simplified: use highest physical stat)
        int8_t attack_bonus = get_ability_modifier(attacker_stats.strength);
        int8_t dex_bonus = get_ability_modifier(attacker_stats.dexterity);
        if(dex_bonus > attack_bonus) attack_bonus = dex_bonus;

        return (d20 + attack_bonus) >= target_ac;
    }

    uint16_t calculate_damage(const character& char_data) {
        uint64_t random = get_random();

        // Base weapon damage (1d8 for most classes)
        uint8_t damage = (random % 8) + 1;

        // Add ability modifier
        int8_t str_mod = get_ability_modifier(char_data.ability_scores.strength);
        int8_t dex_mod = get_ability_modifier(char_data.ability_scores.dexterity);
        damage += (str_mod > dex_mod) ? str_mod : dex_mod;

        return (damage > 0) ? damage : 1;
    }

    uint64_t get_random() {
        // Use transaction ID for randomness
        size_t size = transaction_size();
        char buf[size];
        size_t read = read_transaction(buf, size);
        checksum256 hash = sha256(buf, read);
        return hash.extract_as_byte_array()[0];
    }
};
