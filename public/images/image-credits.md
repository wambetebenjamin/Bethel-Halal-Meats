# Image credits

Every photograph on this site comes from [Pexels](https://www.pexels.com) and is used under the [Pexels licence](https://www.pexels.com/license/), which permits free commercial use. Attribution is not required by the licence, but each source is recorded here.

Files are stored locally in `public/images/` and served from this project. Nothing is hotlinked, and the Pexels API is not called at runtime.

| Local file | Pexels ID | Photo page | Photographer |
|---|---|---|---|
| `hero-butcher.jpg` | 33624072 | https://www.pexels.com/photo/butcher-cutting-meat-at-nigerian-market-33624072/ | Barnabas Sani |
| `butcher-portrait.jpg` | 33191250 | https://www.pexels.com/photo/butcher-preparing-meat-at-outdoor-market-in-nigeria-33191250/ | Vaffah.NG |
| `butcher-hanging.jpg` | 31374534 | https://www.pexels.com/photo/freshly-butchered-meat-hanging-outdoors-31374534/ | Chris wade NTEZICIMPA |
| `beef-steak-board.jpg` | 1314041 | https://www.pexels.com/photo/brown-wooden-chopping-board-with-meat-on-top-1314041/ | Fabio Bueno |
| `beef-marbled.jpg` | 13279401 | https://www.pexels.com/photo/close-up-shot-of-a-raw-meat-on-wooden-surface-13279401/ | Dana Sredojevic |
| `meat-board.jpg` | 8112380 | https://www.pexels.com/photo/raw-meat-on-a-cutting-board-8112380/ | Rachel Claire |
| `goat-cuts.jpg` | 5774154 | https://www.pexels.com/photo/close-up-shot-of-slices-of-raw-meat-on-a-wooden-chopping-board-5774154/ | Luis Becerra Fotografo |
| `lamb-chops.jpg` | 31732111 | https://www.pexels.com/photo/close-up-of-fresh-raw-lamb-chops-31732111/ | Reco Alleyne |
| `beef-spareribs.jpg` | 13611849 | https://www.pexels.com/photo/beef-spareribs-in-close-up-shot-13611849/ | Engin Akyurt |
| `beef-cubes.jpg` | 7163994 | https://www.pexels.com/photo/sliced-meat-on-white-tray-7163994/ | Mark Stebnicki |
| `chicken-whole.jpg` | 10842249 | https://www.pexels.com/photo/overhead-shot-of-a-dressed-chicken-10842249/ | Karyna Panchenko |
| `chicken-portions.jpg` | 10842246 | https://www.pexels.com/photo/close-up-of-a-raw-whole-chicken-10842246/ | Karyna Panchenko |
| `sausages.jpg` | 4504592 | https://www.pexels.com/photo/white-sausage-on-brown-wooden-chopping-board-4504592/ | Radoslaw Wisniewski |
| `offal-livers.jpg` | 18606624 | https://www.pexels.com/photo/close-up-of-meat-and-livers-18606624/ | Dogan Alpaslan Demir |
| `grilled-meat.jpg` | 15407986 | https://www.pexels.com/photo/streetfood-15407986/ | Chechil Orifa |

## Where each image appears

- `hero-butcher.jpg`: homepage hero.
- `butcher-portrait.jpg`: the halal promise section on the homepage.
- `butcher-hanging.jpg`: goat leg, lamb shoulder and gallery frames for goat and lamb cuts.
- `beef-steak-board.jpg`: beef category, beef ribeye and the beef gallery.
- `beef-marbled.jpg`: beef sirloin.
- `meat-board.jpg`: minced beef, goat ribs, beef tripe and several gallery frames.
- `goat-cuts.jpg`: goat category, goat shoulder and the goat gallery.
- `lamb-chops.jpg`: lamb category, lamb chops and the lamb gallery.
- `beef-spareribs.jpg`: beef spareribs.
- `beef-cubes.jpg`: beef stew cubes.
- `chicken-whole.jpg`: chicken category and whole chicken.
- `chicken-portions.jpg`: chicken breast fillets, chicken thighs and chicken sausages.
- `sausages.jpg`: beef sausages and chicken sausages.
- `offal-livers.jpg`: offal category, beef liver and goat kidney.
- `grilled-meat.jpg`: the custom orders section on the homepage.

## People in the photographs

Only two images show people, and both are East African butchers photographed at markets in Nigeria: Barnabas Sani's hero frame from Jos and Vaffah.NG's portrait from Rimi. No other photograph includes a person.

The uploaded template shipped with chef photographs in `img/chefs/`. They remain in the repository unchanged as part of the original template and are not used by the application.

## Replacing an image

Drop a replacement into `public/images/` using the same filename, then update the `image` and `gallery` fields in `lib/products.ts` if the subject changes. `next.config.ts` allows `images.pexels.com` in `remotePatterns` for future remote images, but every image currently ships locally so the site works without network access to a CDN.
