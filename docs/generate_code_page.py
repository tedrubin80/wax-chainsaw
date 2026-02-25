#!/usr/bin/env python3
"""Generate the code.html interactive code browser for the WAX RPG project."""

import html
import os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Files to include in the code browser, in display order
FILES = [
    ("contracts/rpgcharacter.cpp", "cpp", "Smart Contract - Core game logic with D&D 5e mechanics (540+ lines)"),
    ("contracts/CMakeLists.txt", "cmake", "CMake build configuration for EOSIO CDT"),
    ("frontend/src/App.js", "javascript", "Main React application with WAX wallet integration"),
    ("frontend/src/App.css", "css", "App header, tabs, and layout styles"),
    ("frontend/src/index.js", "javascript", "React entry point"),
    ("frontend/src/index.css", "css", "Global styles and dark theme"),
    ("frontend/src/components/LandingPage.js", "javascript", "Portfolio landing page with mock data and animations"),
    ("frontend/src/components/LandingPage.css", "css", "Landing page sections, hero, battle demo, and responsive styles"),
    ("frontend/src/components/CharacterCard.js", "javascript", "Character NFT card with ability scores and stats"),
    ("frontend/src/components/CharacterCard.css", "css", "Character card styling with rarity borders"),
    ("frontend/src/components/BattleArena.js", "javascript", "PvP battle interface with character selection"),
    ("frontend/src/components/BattleArena.css", "css", "Battle arena layout and combat button"),
    ("frontend/src/components/MintCharacter.js", "javascript", "Character creation form with race/class/rarity"),
    ("frontend/src/components/MintCharacter.css", "css", "Mint form, option cards, and rarity selection"),
    ("frontend/package.json", "json", "Frontend React dependencies"),
    ("package.json", "json", "Root project configuration"),
    ("build.sh", "bash", "Contract compilation script"),
    ("deploy.sh", "bash", "WAX testnet deployment script"),
    ("start.sh", "bash", "Frontend startup script"),
]

def get_file_icon(lang):
    icons = {
        "cpp": "C++",
        "javascript": "JS",
        "css": "CSS",
        "json": "{ }",
        "bash": "SH",
        "cmake": "CM",
    }
    return icons.get(lang, "?")

def get_folder_structure():
    """Build the folder tree for the sidebar."""
    tree = {}
    for filepath, lang, desc in FILES:
        parts = filepath.split("/")
        node = tree
        for part in parts[:-1]:
            if part not in node:
                node[part] = {}
            node = node[part]
        node[parts[-1]] = (filepath, lang, desc)
    return tree

def render_tree_html(tree, indent=0):
    """Render the file tree as HTML."""
    lines = []
    # Separate folders and files
    folders = {k: v for k, v in tree.items() if isinstance(v, dict)}
    files = {k: v for k, v in tree.items() if isinstance(v, tuple)}

    for folder_name in sorted(folders.keys()):
        folder_id = f"folder-{folder_name}-{indent}"
        lines.append(f'{"  " * indent}<div class="tree-folder" onclick="toggleFolder(this)">')
        lines.append(f'{"  " * indent}  <span class="folder-icon">&#x25B6;</span>')
        lines.append(f'{"  " * indent}  <span class="folder-name">{html.escape(folder_name)}/</span>')
        lines.append(f'{"  " * indent}</div>')
        lines.append(f'{"  " * indent}<div class="tree-children">')
        lines.append(render_tree_html(folders[folder_name], indent + 1))
        lines.append(f'{"  " * indent}</div>')

    for filename, (filepath, lang, desc) in sorted(files.items()):
        file_id = filepath.replace("/", "-").replace(".", "-")
        icon = get_file_icon(lang)
        lines.append(f'{"  " * indent}<div class="tree-file" data-file="{html.escape(file_id)}" onclick="showFile(\'{html.escape(file_id)}\')" title="{html.escape(desc)}">')
        lines.append(f'{"  " * indent}  <span class="file-icon">{icon}</span>')
        lines.append(f'{"  " * indent}  <span class="file-name">{html.escape(filename)}</span>')
        lines.append(f'{"  " * indent}</div>')

    return "\n".join(lines)

def render_code_blocks():
    """Render all code blocks as hidden pre elements."""
    blocks = []
    for filepath, lang, desc in FILES:
        file_id = filepath.replace("/", "-").replace(".", "-")
        full_path = os.path.join(PROJECT_ROOT, filepath)

        try:
            with open(full_path, "r") as f:
                content = f.read()
        except FileNotFoundError:
            content = f"// File not found: {filepath}"

        line_count = content.count("\n") + 1
        escaped = html.escape(content)

        blocks.append(f'<div class="code-panel" id="panel-{file_id}" style="display:none" data-path="{html.escape(filepath)}" data-lang="{lang}" data-desc="{html.escape(desc)}" data-lines="{line_count}">')
        blocks.append(f'<pre><code class="language-{lang}">{escaped}</code></pre>')
        blocks.append('</div>')

    return "\n".join(blocks)

def main():
    tree = get_folder_structure()
    tree_html = render_tree_html(tree)
    code_blocks = render_code_blocks()

    # First file ID for default display
    first_id = FILES[0][0].replace("/", "-").replace(".", "-")

    page = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WAX RPG Collection - Code Browser</title>
  <meta name="theme-color" content="#1e1e2e">
  <!-- Highlight.js for syntax highlighting -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/cpp.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/cmake.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/bash.min.js"></script>
  <style>
    * {{ margin: 0; padding: 0; box-sizing: border-box; }}

    body {{
      font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
      background: #1e1e2e;
      color: #ffffff;
      height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }}

    /* ---- Top Bar ---- */
    .topbar {{
      background: rgba(30, 30, 46, 0.95);
      border-bottom: 1px solid rgba(124, 58, 237, 0.3);
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }}

    .topbar-left {{
      display: flex;
      align-items: center;
      gap: 20px;
    }}

    .topbar-brand {{
      font-size: 1.1rem;
      font-weight: 800;
      background: linear-gradient(90deg, #7c3aed, #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-decoration: none;
    }}

    .topbar-back {{
      color: #a78bfa;
      text-decoration: none;
      font-size: 0.85rem;
      padding: 5px 14px;
      border: 1px solid rgba(124, 58, 237, 0.4);
      border-radius: 6px;
      transition: all 0.2s;
    }}

    .topbar-back:hover {{
      background: rgba(124, 58, 237, 0.15);
    }}

    .file-info {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}

    .file-path {{
      color: #9ca3af;
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
    }}

    .file-meta {{
      display: flex;
      gap: 12px;
      font-size: 0.75rem;
      color: #6b7280;
    }}

    .file-meta span {{
      background: rgba(124, 58, 237, 0.15);
      border: 1px solid rgba(124, 58, 237, 0.25);
      padding: 2px 8px;
      border-radius: 4px;
    }}

    /* ---- Main Layout ---- */
    .main {{
      display: flex;
      flex: 1;
      overflow: hidden;
    }}

    /* ---- Sidebar ---- */
    .sidebar {{
      width: 280px;
      min-width: 280px;
      background: rgba(20, 20, 35, 0.95);
      border-right: 1px solid rgba(124, 58, 237, 0.2);
      overflow-y: auto;
      padding: 12px 0;
      flex-shrink: 0;
    }}

    .sidebar-header {{
      padding: 8px 16px 14px;
      font-size: 0.75rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 1px solid rgba(124, 58, 237, 0.15);
      margin-bottom: 8px;
    }}

    .tree-folder {{
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 16px;
      cursor: pointer;
      user-select: none;
      transition: background 0.15s;
    }}

    .tree-folder:hover {{
      background: rgba(124, 58, 237, 0.1);
    }}

    .folder-icon {{
      font-size: 0.6rem;
      color: #a78bfa;
      transition: transform 0.2s;
      display: inline-block;
      width: 12px;
    }}

    .tree-folder.open > .folder-icon {{
      transform: rotate(90deg);
    }}

    .folder-name {{
      color: #a78bfa;
      font-size: 0.85rem;
      font-weight: 600;
    }}

    .tree-children {{
      padding-left: 16px;
      display: none;
    }}

    .tree-folder.open + .tree-children {{
      display: block;
    }}

    .tree-file {{
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 16px;
      cursor: pointer;
      transition: all 0.15s;
      border-left: 2px solid transparent;
    }}

    .tree-file:hover {{
      background: rgba(124, 58, 237, 0.1);
    }}

    .tree-file.active {{
      background: rgba(124, 58, 237, 0.2);
      border-left-color: #7c3aed;
    }}

    .file-icon {{
      font-size: 0.6rem;
      font-weight: 800;
      color: #6b7280;
      min-width: 24px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(124, 58, 237, 0.1);
      border-radius: 3px;
      font-family: monospace;
    }}

    .tree-file.active .file-icon {{
      color: #a78bfa;
      background: rgba(124, 58, 237, 0.25);
    }}

    .file-name {{
      color: #d1d5db;
      font-size: 0.83rem;
    }}

    .tree-file.active .file-name {{
      color: #ffffff;
      font-weight: 600;
    }}

    /* ---- Code Area ---- */
    .code-area {{
      flex: 1;
      overflow: auto;
      background: #282c34;
    }}

    .code-desc {{
      padding: 12px 20px;
      background: rgba(0, 0, 0, 0.3);
      border-bottom: 1px solid rgba(124, 58, 237, 0.15);
      color: #9ca3af;
      font-size: 0.85rem;
    }}

    .code-panel pre {{
      margin: 0;
      padding: 0;
    }}

    .code-panel pre code {{
      padding: 20px !important;
      font-family: 'Fira Code', 'Cascadia Code', 'JetBrains Mono', 'Courier New', monospace;
      font-size: 0.84rem;
      line-height: 1.65;
      tab-size: 4;
    }}

    /* Override highlight.js background */
    .hljs {{
      background: transparent !important;
    }}

    /* Line numbers */
    .code-panel pre code {{
      counter-reset: line;
    }}

    .line-numbers {{
      display: flex;
    }}

    .line-nums {{
      padding: 20px 0;
      padding-right: 16px;
      text-align: right;
      color: #4b5563;
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 0.78rem;
      line-height: 1.65;
      user-select: none;
      min-width: 50px;
      border-right: 1px solid rgba(124, 58, 237, 0.1);
      padding-left: 16px;
      flex-shrink: 0;
    }}

    .line-nums span {{
      display: block;
    }}

    .code-content {{
      flex: 1;
      overflow-x: auto;
    }}

    /* ---- Search ---- */
    .search-box {{
      padding: 8px 12px;
      margin: 0 12px 8px;
    }}

    .search-box input {{
      width: 100%;
      padding: 6px 10px;
      background: rgba(124, 58, 237, 0.1);
      border: 1px solid rgba(124, 58, 237, 0.25);
      border-radius: 6px;
      color: #d1d5db;
      font-size: 0.8rem;
      outline: none;
    }}

    .search-box input:focus {{
      border-color: #7c3aed;
    }}

    .search-box input::placeholder {{
      color: #4b5563;
    }}

    /* ---- Responsive ---- */
    @media (max-width: 768px) {{
      .sidebar {{
        width: 220px;
        min-width: 220px;
      }}
      .file-info {{
        display: none;
      }}
    }}

    @media (max-width: 600px) {{
      .sidebar {{
        position: absolute;
        z-index: 10;
        height: calc(100vh - 50px);
        transform: translateX(-100%);
        transition: transform 0.3s;
      }}
      .sidebar.open {{
        transform: translateX(0);
      }}
      .toggle-sidebar {{
        display: block !important;
      }}
    }}

    .toggle-sidebar {{
      display: none;
      background: none;
      border: 1px solid rgba(124, 58, 237, 0.4);
      color: #a78bfa;
      padding: 4px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }}

    /* Scrollbar styling */
    ::-webkit-scrollbar {{ width: 8px; height: 8px; }}
    ::-webkit-scrollbar-track {{ background: rgba(0,0,0,0.2); }}
    ::-webkit-scrollbar-thumb {{ background: rgba(124, 58, 237, 0.3); border-radius: 4px; }}
    ::-webkit-scrollbar-thumb:hover {{ background: rgba(124, 58, 237, 0.5); }}
  </style>
</head>
<body>
  <!-- Top Bar -->
  <div class="topbar">
    <div class="topbar-left">
      <button class="toggle-sidebar" onclick="document.querySelector('.sidebar').classList.toggle('open')">&#x2630;</button>
      <a href="index.html" class="topbar-brand">WAX RPG Collection</a>
      <a href="index.html" class="topbar-back">&#x2190; Back to Overview</a>
    </div>
    <div class="file-info">
      <span class="file-path" id="current-path">contracts/rpgcharacter.cpp</span>
      <div class="file-meta">
        <span id="current-lang">C++</span>
        <span id="current-lines">541 lines</span>
      </div>
    </div>
  </div>

  <!-- Main Layout -->
  <div class="main">
    <!-- Sidebar File Tree -->
    <div class="sidebar">
      <div class="sidebar-header">Explorer</div>
      <div class="search-box">
        <input type="text" placeholder="Search files..." id="file-search" oninput="filterFiles(this.value)">
      </div>
      <div id="file-tree">
{tree_html}
      </div>
    </div>

    <!-- Code Display -->
    <div class="code-area" id="code-area">
      <div class="code-desc" id="code-desc"></div>
      <div id="code-container">
{code_blocks}
      </div>
    </div>
  </div>

  <script>
    let activeFile = null;
    let highlighted = new Set();

    function showFile(fileId) {{
      // Hide current
      document.querySelectorAll('.code-panel').forEach(p => p.style.display = 'none');
      document.querySelectorAll('.tree-file').forEach(f => f.classList.remove('active'));

      // Show selected
      const panel = document.getElementById('panel-' + fileId);
      if (!panel) return;

      panel.style.display = 'block';
      activeFile = fileId;

      // Highlight on first view
      if (!highlighted.has(fileId)) {{
        const codeEl = panel.querySelector('code');
        if (codeEl) {{
          hljs.highlightElement(codeEl);

          // Add line numbers
          const lines = codeEl.innerHTML.split('\\n');
          const lineNums = document.createElement('div');
          lineNums.className = 'line-nums';
          for (let i = 1; i <= lines.length; i++) {{
            const span = document.createElement('span');
            span.textContent = i;
            lineNums.appendChild(span);
          }}

          const wrapper = document.createElement('div');
          wrapper.className = 'line-numbers';
          wrapper.appendChild(lineNums);

          const codeContent = document.createElement('div');
          codeContent.className = 'code-content';
          const pre = panel.querySelector('pre');
          codeContent.appendChild(pre);
          wrapper.appendChild(codeContent);
          panel.appendChild(wrapper);
        }}
        highlighted.add(fileId);
      }}

      // Update info bar
      document.getElementById('current-path').textContent = panel.dataset.path;
      document.getElementById('current-lang').textContent = panel.dataset.lang.toUpperCase();
      document.getElementById('current-lines').textContent = panel.dataset.lines + ' lines';
      document.getElementById('code-desc').textContent = panel.dataset.desc;

      // Mark active in tree
      const treeFile = document.querySelector('.tree-file[data-file="' + fileId + '"]');
      if (treeFile) treeFile.classList.add('active');

      // Close sidebar on mobile
      document.querySelector('.sidebar').classList.remove('open');

      // Scroll to top
      document.getElementById('code-area').scrollTop = 0;
    }}

    function toggleFolder(el) {{
      el.classList.toggle('open');
    }}

    function filterFiles(query) {{
      const q = query.toLowerCase();
      document.querySelectorAll('.tree-file').forEach(file => {{
        const name = file.querySelector('.file-name').textContent.toLowerCase();
        file.style.display = name.includes(q) ? 'flex' : 'none';
      }});
      // Show all folders when searching
      if (q) {{
        document.querySelectorAll('.tree-folder').forEach(f => f.classList.add('open'));
        document.querySelectorAll('.tree-children').forEach(c => c.style.display = 'block');
      }}
    }}

    // Open all folders and show first file on load
    window.addEventListener('DOMContentLoaded', () => {{
      document.querySelectorAll('.tree-folder').forEach(f => f.classList.add('open'));
      showFile('{first_id}');
    }});
  </script>
</body>
</html>'''

    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "code.html")
    with open(output_path, "w") as f:
        f.write(page)

    print(f"Generated {output_path}")
    print(f"Total files embedded: {len(FILES)}")
    total_lines = 0
    for filepath, lang, desc in FILES:
        full_path = os.path.join(PROJECT_ROOT, filepath)
        try:
            with open(full_path, "r") as f:
                lines = f.read().count("\n") + 1
                total_lines += lines
        except FileNotFoundError:
            pass
    print(f"Total lines of code: {total_lines}")

if __name__ == "__main__":
    main()
