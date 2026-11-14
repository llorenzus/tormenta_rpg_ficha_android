import pypdf

reader = pypdf.PdfReader('fontes_tormenta/o-mundo-de-arton-o-panteao-taverna-do-elfo-e-do-arcaniospdf.pdf')

full_text = []
for p in range(9, 17):
    full_text.append(f"\n--- PÁGINA {p+1} ---\n")
    full_text.append(reader.pages[p].extract_text() or '')

with open('scratch/panteao_talentos_raw.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(full_text))

print("Texto extraído para scratch/panteao_talentos_raw.txt")

