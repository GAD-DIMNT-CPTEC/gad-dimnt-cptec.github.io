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

A análise de temperatura à superfície e as curvas de minimização são obtidas do monitoramento público do SMNA. A página consulta o ciclo de 00 UTC do dia anterior, segundo o calendário de America/Sao_Paulo, ao abrir, ao retornar à aba e a cada 30 minutos. As duas imagens só são substituídas quando ambas estão disponíveis e decodificadas. O último par é salvo no navegador via IndexedDB; os arquivos em assets são a reserva inicial.

## Publicação

GitHub Pages publica a raiz da branch main. Os links externos abrem em nova aba.
