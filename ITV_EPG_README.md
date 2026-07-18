# itv.uz EPG (XMLTV)

itv.uz'дан **ўзбек ва рус телеканаллар** учун телепрограмма (EPG) — 8 кунлик, XMLTV форматда.
GitHub Actions ҳар куни автомат янгилайди (кечаси 04:00, UZB).

**203 канал** · **~124,000 дастур** · ~6.8MB (gz)

## 📡 URL (иловага қўшиш учун)

```
https://github.com/joniasus/itv-epg/releases/latest/download/itv_epg.xml.gz
```

`joniasus` — сизнинг GitHub username'ингиз.

## 🚀 Ўрнатиш (бир марта, ~5 дақиқа)

1. GitHub'да янги **public** repo яратинг, номи: **`itv-epg`**
2. Шу папкадаги 3 файлни repo'га юкланг (git push ёки веб-интерфейс «Add file → Upload»):
   - `itv_epg_gen.js`
   - `.github/workflows/itv_epg.yml`
   - `README.md`
3. Repo → **Settings → Actions → General**:
   - «Actions permissions» → **Allow all actions**
   - «Workflow permissions» → **Read and write permissions** ✅ (муҳим — release ясаш учун)
4. Repo → **Actions** таб → чапда **`itv-epg`** → ўнгда **Run workflow** тугмаси (биринчи марта қўлда)
5. ~3 дақиқада **Releases** бўлимида `latest` release ва `itv_epg.xml.gz` пайдо бўлади

## 📺 Иловада ишлатиш

1. «Локальное EPG» → юқоридаги URL'ни қўшинг
2. Режим: **OTT-Play** + «Использовать локальное EPG = **Да**»
3. Каналлар программа кўрсатади

**Channel id формати:** `itv-<channelId>` (масалан `itv-256` = ZO'R TV FHD, `itv-10` = Futbol TV).
Плейлистдаги `tvg-id`'ни `itv-<channelId>` қилиб мослаш ёки ном бўйича (OTT FOSS) ишлайди.

## ⚙️ Қандай ишлайди

- `itv_epg_gen.js` → `gw.itv.uz` API'дан (get-list + epg/get-days + epg/get-items) маълумот олади
- XMLTV (channel + programme) ясайди, gzip қилади
- Auth керак эмас (фақат `Referer: https://itv.uz/`)
- Manba: itv.uz (TAS-IX)
