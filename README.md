# Grupo de Assimilação de Dados — GAD

Homepage do GAD, DIMNT/CPTEC/INPE.

Site: https://gad-dimnt-cptec.github.io/

## Conteúdo

Atividades de pesquisa, desenvolvimento e operação; software; equipe; publicações; material didático. Disponível em português, inglês e espanhol, com modo noturno.

## Desenvolvimento local

```sh
python3 -m http.server 8765
```

Abra http://localhost:8765/. O site utiliza HTML, CSS e JavaScript, sem etapa de compilação.

## Figuras do monitoramento

A análise de temperatura à superfície e as curvas de minimização são obtidas do monitoramento público do SMNA. A página prioriza o ciclo de 00 UTC de hoje e tenta o dia anterior apenas se o par de hoje estiver incompleto, segundo o calendário de America/Sao_Paulo, ao abrir, ao retornar à aba e a cada 5 minutos. As duas imagens só são substituídas quando ambas estão disponíveis e decodificadas. O último par é salvo no navegador via IndexedDB; os arquivos em assets são a reserva inicial (12/10/2026 às 00 UTC). Respostas sem Content-Type também são aceitas quando ambas as imagens decodificam corretamente.

## Publicação

GitHub Pages publica a raiz da branch main. Os links externos abrem em nova aba.
