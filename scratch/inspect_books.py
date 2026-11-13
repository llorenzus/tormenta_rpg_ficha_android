import pypdf
import os
import re

files = [
    "fontes_tormenta/o-mundo-de-arton-o-panteao-taverna-do-elfo-e-do-arcaniospdf.pdf",
    "fontes_tormenta/Tormenta RPG - Manual das Raças.pdf"
]

for filepath in files:
    print(f"\n==========================================")
    print(f"Arquivo: {filepath}")
    reader = pypdf.PdfReader(filepath)
    num_pages = len(reader.pages)
    print(f"Total de páginas: {num_pages}")
    
    # Busca por bookmarks/outlines
    try:
        outlines = reader.outline
        if outlines:
            print("Bookmarks encontrados:")
            def print_outline(items, depth=0):
                for item in items:
                    if isinstance(item, list):
                        print_outline(item, depth+1)
                    else:
                        title = getattr(item, 'title', str(item))
                        page = reader.get_destination_page_number(item) if hasattr(reader, 'get_destination_page_number') else '?'
                        print(f"{'  '*depth}- {title} (pág {page})")
            print_outline(outlines[:30])
    except Exception as e:
        print(f"Erro ao ler outline: {e}")

    # Vamos pesquisar em quais páginas ocorrem termos como "Talentos Regionais", "Novos Talentos", "Novas Magias"
    termos = ["Talentos Regionais", "Talento Regional", "Novos Talentos", "Novas Magias", "Capítulo"]
    encontrados = {t: [] for t in termos}
    for idx, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        for t in termos:
            if re.search(r'\b' + re.escape(t) + r'\b', text, re.IGNORECASE):
                encontrados[t].append(idx + 1)
                
    for t, pgs in encontrados.items():
        if pgs:
            print(f"Termo '{t}' encontrado nas páginas: {pgs[:25]}")

