project(rpgcharacter)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract(rpgcharacter rpgcharacter rpgcharacter.cpp)
target_include_directories(rpgcharacter PUBLIC ${CMAKE_SOURCE_DIR}/../include)
