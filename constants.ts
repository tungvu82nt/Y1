import { Product, User } from './types';

export const USER: User = {
  name: "Alex Doe",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6t_dRB19JImstLCu4W9SOxGWsuFOMpVeu-1nBEfbtc77jwR_AWnxlUBt2OWIYBlg5Ac0H6m1nZdpe_UqkTc1Ve74ruuIvLA_xjaQk6MlHXTDWaI9JhrdtKcpZXE8lyiIM4XtIymuXVz9njJ5uh4r5lsTektoVoz0Zvxf4DR0w3GNan9LU5MRdvUBKIwrOr02VEQ6O1pp7YXyKsgAE5gJ2JNUGiHzNdJLkhd0BsMZej7Wcmy9ItbX9tMbDI7Wb0lb21dBhCwQ3OZLo",
  memberSince: "2021",
  location: "New York, USA",
  isVip: true,
  role: 'customer'
};

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Velocity Runner 5000",
    brand: "ShoeSwift",
    category: "Running",
    price: 125.00,
    originalPrice: 160.00,
    rating: 4.8,
    reviews: 1248,
    tags: ['new', 'sale'],
    discount: "-20%",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi4rZZgCVNZsUK-PF9Liv9-AtJZeFSBEplBpy0efxyFdZ_bBSP0YHZu2uSQEgOAGNUX2ztKR8IXQOLerOaYALj6JwtkO6e9fBnQVzPZRsNjagRRwYaV8NCj9R-rj6LIQfbzjuKvSfofAa28T6_MBL_LqrrXAVQFOzf6zbyka59GQJrY6AXL-qKv1Ofdcs4rIGf-m6NoxfkSFRYs-HQpLghBa3_x37nFfaParbf2E4npyPcY-LN8VrZ1uXSjDqXt4NqwdtujisSRRQK"
  },
  {
    id: "2",
    name: "Zoom Pegasus 39",
    brand: "Nike",
    category: "Running",
    price: 72.00,
    originalPrice: 120.00,
    discount: "-40%",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCINQmMcXGZFvw7iBcbRxNzbhw_j4-NwGOW870C8-aknj3ZrrlkeQXEiczRMCKFtrlCsv9Lagd0FJi0PAfAHKfb7GqtShkPlh1nKntVsPzzxem-UjwYsPmBQVNcQHdQpM6IyEbpA6UZeK-hWd1PqNeR_TZGBzeSwc90MdqWfnM602tLIH6lrQfRdqPgqpQrtHO5L74oA6S5xkj4TSLd8Ed1dqTCawWTMfiGhFNPxdO__V60tfWAllON1H4kDcyecwlvHXJ_rhg4ck-S"
  },
  {
    id: "3",
    name: "Air Max 90 Futura",
    brand: "Nike",
    category: "Lifestyle",
    price: 97.50,
    originalPrice: 150.00,
    discount: "-35%",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqGc2nNVdSqSjBUF8a0F24svjj3E3KXPu4mjta9lsrswBkcXvjog2oXEggo7J0dvkkSSX8gXhTzoKmxLYblSI9huG2tMVuROFqyfwPAivfivTyIryeyLHHWS1EYp3wJE2MONNVhJdMchHLayCRq4J8ZWS5a1kAIGGM2v--lgI5g_Z-10VS2BfEPeif21Xe0ySbYPYk29qMoTpAYbVGGrM16eVgWuC7O0sRopZrlbK1mMwa8U7cqxd29ZyrR0J1FOL6PqL26zmcA0pg"
  },
  {
    id: "4",
    name: "Vans Old Skool",
    brand: "Vans",
    category: "Skateboarding",
    price: 35.00,
    originalPrice: 70.00,
    discount: "-50%",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEvf-0181baT3Yq7Ae0Dr5gZXlD4f7ZdLQW0_p-NwXIsP3PkWLKext9WMUuH8xRgD9wbdUdLAsyBeSS-36pC9PlUVTIP0_WgdwZ5jhD-1YwZdV42FhpRCCtgNW6masmDTxfzM-szMlxaR1297GdObxJwdeJrLfOEDQRwbBanngC-CChX6D6PnlK3PetHI1dmeIdL4VrUd_cD0oypFieE4YaZcBnnbhFsBIP46QlO4S7HGN_mP_WEd9MrdLi_KdaRibXIqr-vhel1K8"
  },
  {
    id: "5",
    name: "Jordan Retro 4",
    brand: "Jordan",
    category: "Basketball",
    price: 168.00,
    originalPrice: 210.00,
    discount: "-20%",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlE3q1pIF2n7BTsQO72jL3GLbFD7KFjFQPutuWav3DnfXK1jDlwjSI-9VnO_Iv_3u34nO0vGt19AoF0ymUJRjp7nx5m4N_mJjsWoEvpJEHs4XaaMWuECYlQ-yxofJHxb9ms2S9NthAM25sPj-X1nnGKnWHkTZY9p3eW9Lv14GsYaUjyHYKSOGvUeQZxzZYBWUKVhHIJJ6rkF--uCOmjP8-PuuSt02UUxyOebOJuNycta1Rnc2oywBJp754kOG2lskHtO9uTqNe_M8I"
  },
  {
    id: "6",
    name: "Nike Air Force 1 '07",
    brand: "Nike",
    category: "Lifestyle",
    price: 110.00,
    rating: 4.9,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-npXDF-DblMyjxJLnT_7JkiVCXdCPkIrvFIoFi7AQ571Ja2mAUsJd0cp7MuxNxjUqAUPd8t4pFuNUgApDFKRxOMT8R6k1cBxx9z3g6rmhjHAHHYNKVFAQ3YODWDZME-QCwfEY383SL9xHy6SkwIDUAKRZtPM7qfj6sfguxiye7XGXawCG3pIKDGc-2vbKImBltZETh7DQe889XXo-m639rsBzgdkJyYmNlFy8ZwskC16XJ4FW9oRQovzf8-5BwfkmJYpepRta_2Y0"
  },
  {
    id: "7",
    name: "Adidas Ultraboost Light",
    brand: "Adidas",
    category: "Running",
    price: 190.00,
    rating: 4.8,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9dUCUKHCZ5RCmLhFvxpZqwqDAfWJJUnUnrEFMAmtDJNjcJR_V9t2jAvRkBVKiYIwDReYxfASkdpRWwK55WbL-LuRWMFqolP5aeC9n8OfrOAll3YvGBxOZABI1B9NfzsQDYYm_tnAFp8XGHT0Gn6R-Clxi7ej4hmQ7asOA5Wf2acg5aRMyVceR9nyTVqzOkC7OLt8GI8Nfjw3ch_8xzoUEWCYEBnMJiRQBtbpNaEcaa-ZTMzT3bKXIH3Fio0Se6BAOIV5ESeyS4o6_"
  },
  {
    id: "8",
    name: "Converse Chuck 70",
    brand: "Converse",
    category: "Unisex",
    price: 90.00,
    rating: 5.0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuApP4ME5iocKsKLIMxwnwtF9ohf47D64ejhcI23zEo-AGmwPWfq7FS845Iz42BVZb-77kUi299nyuOHocNVwLokqpL6h2ac4EC4F0l_Bb5QwD1nU8OqUEv4S8PWoTPjUnQDgDjeLD6kJrS_LIEyuOZwKZ9XpkAP09fOauhbQpXmtMhbAbwN6dBqIevfXs9uXB6D5q7PHyCbgJMGiXsp0pBOfkg2K5iN5bSOLa2wwTtGKQ5B_SXhAy_u3R9CZCHkFBJ61aCAWgQU8Wy9"
  },
  {
    id: "9",
    name: "New Balance 550",
    brand: "New Balance",
    category: "Lifestyle",
    price: 120.00,
    rating: 4.7,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbPigw5fzTXkQ3MK2Ddjyai-sgPgaKdE7OUWvqkU5vyS3nc3c6edtIjd8yjuefPnZOD962ksOKSX9AQgAi7EEY5db6catVmzplurIHrJntGIUtuzM9EuFEzbbMW9457m6foR5t6WQTcm_2suu8PXINNYdLWNjDsPIDJYFVguEN7IOynfAQIKdqA8LkTXT29xpPs9jeZ0q1SyV9vflK6j01Z2b_KCaAyR6J3WCFTV8BKvp5egalQU0Y93kCyljjaGgQY9prvCnZme69"
  },
  {
    id: "10",
    name: "Air Jordan 1 Mid SE",
    brand: "Jordan Brand",
    category: "Lifestyle",
    price: 135.00,
    rating: 4.6,
    tags: ['best-seller'],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqHxXmNxujB7yPHCqS5D29QRlBceRlhn-r_K8tuGPHooj5YYPgeGGHoZ7RwTOtbieCUrGOgsWCj1wVjR6jGTLG200mJSkzS7C7dLXslSvJFl1czsGEr4yUR60ktIIKMwZzxD4tuYs69Y8fS3JClPo2J3WWfmbG0z_h7LtPgAxx7K3yTCVkWGMW5LAvk_kC9WBo5dEL3cm_5bmoLbPgtI-sE0P4QTj2XQI-OoojH4NJAjaBnd1Eu719fpzfRJiZ78M9k-WyIleCAtHh"
  },
  {
    id: "11",
    name: "Nike Air Zoom Pegasus",
    brand: "Nike",
    category: "Running",
    price: 120.00,
    rating: 4.5,
    tags: ['new'],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgDbegz_wCiS9Yu-vflJKVOPp39TpYByEAvsbwhPVwL2DyR_glpRdRtDWTID4h_zqKWSaOnskA197LErl6PyIfXCWg37nUP9DUtvPH_rNM9J3aqN58PVbhF2d8IfkBXoqXddXcg7Uv-42_3YqDD19OjF9HI1R3ipp5AlbV0w4meTMftsoBmBFYjZXicIbd5wrUdDy-1uJJQRPKuGMPihRmot7pKUGXaZ0GgJ-mtVSm0VMXqq_DICn0hEEUDJleGGS1-xhUKsQNfe3F"
  },
  {
    id: "12",
    name: "Nike Metcon 8",
    brand: "Nike",
    category: "Training",
    price: 104.00,
    originalPrice: 130.00,
    rating: 4.7,
    discount: "-20%",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdYLEZO3i9l9SJJXwpmXV_KwHBrHh-wW-xrPv8Wh-yNU7RAaRIjXBk8fDENwGGQcCtqBiJyKbepdlzdv-M8sUDE1ty07_bmfuFgihF2wkZc78oCPpd-7FY_j1T0oPN1GAQa1jueOXYanivsUZ04gjGqQ60nDL6blNYaqr_EXwEqokGpBk9qoa9Rh2nWv2PbY_qDw-H3eSsr3bz7G0n2ad2yXhga6y6Gdh2lUYOG54rery3liXDauguHynyiH1LpAtttC3vOjE-52s3"
  }
];

export const CATEGORIES = [
  { name: 'Performance', sub: 'Engineered for speed', img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPIvcmX11M29B4T5CgOyf9DNC7i8w6-7AGKH40a_XR_xRJHrfqYvKudz5c9VnIhdga4ELObLOKpm3Mc8h5YID62h1OdbqYe3NkjWxurzzZB9fZxO2VLUW4w1kMJJj8wlW9vzyI2z8FMDuuHFyUit4ONuxU7MGZRWQTji7CGigMxp_9O3yRgh_o_if6gBte2EhopRIpFGQZv7g0Pr_puCL0kXXx1TguXhQum6baqXTTUb6-E1WrkopWCofm6N6UoZb2JDluUgfBhdZg" },
  { name: 'Street Style', sub: 'Everyday essentials', img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBery9lspjsO-hM5cBsVisNt7bez2_-y8ZrOFBSJ--4izRKhCxsnZp5pbfGnF8b_f7sfxYYyHa-6veAaLx8hkLRzeqqCylS7D0-EYIvwrF6hQguELDgVgMuYMvsockkaRgYTIT-AyM5s4hlbBIvDchkmWFIskF9FsY2xAXoZPJxDLszT3j75qlN2F2toqdD41ELnNL9fK6btsQLbk7irM_3SVXNTk-pcFE3qxtZmwlfr65yyh3cu0_DAh-Lfplw6CMvQOpnUkaQAbLS" },
  { name: 'Court Ready', sub: 'Dominate the paint', img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOGBPTi7iSRD8wFxm7UOX1sI5-PyVLZeWWQcYCVxQ8s5NPQmaHFnhCFRBkKxthpEJ_SX7wxZk1silttLuNeL5jCghTnJVMC9XkBmxonz-2pFYuIg70ZGvwy9TXa8NrYS0t_xxb9ItbDmqkKgXmJAnmchQFQh-Fh2sfVM0h9LFsYuFoJE9EaXlF-LEvVoR0mrf2ZifKL1hy0YqHYNcUK3U_lpsC9AS8qMOU50GY_Z1FKbF_wcvgrUZ1ehG_mRZ7_2TiVMzWO-g1Tno_" },
  { name: 'All-Day Comfort', sub: 'Walk on clouds', img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSPy5-xXzLTj2T5g6hs2nKRVaTQrE-GgZORGjjpWASsKbB5FryGI4wxQv4sw2VmW898M-bVbQLHJ1ztMytpCOfKmQ4Aoe6Jmst1ur59BCMc2D-zGEGpLh_ZcLImmsSKGuFfeGBcZRQ2yUXKL_Uhsnk97St4CVwiNAkgxydXxaiyXal7dmzZLhEH2zn04GFk1_poh7PjY_pK-BXz54c9Vs-QRwrKhEpF8sKl9WJFx-KZsoedtFBT4V3-wdVmriO_n-XzRj3tSe9Wxjp" }
];

export const IMAGES = {
  HERO: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvt40xesHIIm744wTuFR-c6uOpx6js5iooBhSzBWOb06Xlfkv_jVkSaKLgqzhLNBhnEutmG9X97mgzeFerKzraxkaQV9LKV8xeOd7tP6V6x30wSC-FD26PkCP7nqHGW1HcCOJdwcvfk7w7bWW5HMfUtlr2EwzTdJ6JjM5QziXp745QsQozhWhZiqOf5ABUknuuiDbL1IbYM3m7lCL3ljlU0B4t3OB3ZmJJ8IOrcD0qrl2Q5z6CiPgbIPWIc1gJ1Tr4xP_eL0Hd7BfE",
  BANNER_URBAN: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhUShwXc3isaO8vFleSC0pqkhx63RNv-oIqWr-yy1v4NZpVIrIkgEfCTihTyz1KtEb-sz29Feai2pyjK-YndUc5u2m1cpdI4fsWOyT_eZZ8eVGQAE3rb6tA6trtHEjtbXOI6y62ID70TmL2tkE6jqBcud_-Czn5nZ5nnKCvD8HTARxPyPEU6isnq7-urs7zRZwEYVRuUyClH_o5Wrjw3wIJuTc2dLwSErtUHogJjRE4-kNbHOZpgHPR6IAUud8N_GSO0cDjiONIWJA",
  PDP_MAIN: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi4rZZgCVNZsUK-PF9Liv9-AtJZeFSBEplBpy0efxyFdZ_bBSP0YHZu2uSQEgOAGNUX2ztKR8IXQOLerOaYALj6JwtkO6e9fBnQVzPZRsNjagRRwYaV8NCj9R-rj6LIQfbzjuKvSfofAa28T6_MBL_LqrrXAVQFOzf6zbyka59GQJrY6AXL-qKv1Ofdcs4rIGf-m6NoxfkSFRYs-HQpLghBa3_x37nFfaParbf2E4npyPcY-LN8VrZ1uXSjDqXt4NqwdtujisSRRQK",
  PDP_THUMBS: [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDxiGmzOk7-XhyUIkuSnyQ036YLmRikC_I0RcKXM-wCMIlfN28z6umwh4BdXnyR-OeaJ5pNoVKldWtwIFGqpDGs26er-HCQjrRADbZNL1EPa_6qDBDKA_8bCsFrsfwZyEiQSMM_4sHPibILzcEOpl9LnZezK__3lOAMhyPB-MtGmTnDrk6PC90-UCwPFO73Z1zXQF5MwLPx0kt0HCZQyYa9nV3yNEOH9OH7uCsub9QtcYNzx_JoNmQKy-jZ0ZooUaDBGHRWEWeau3Bg",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCdD1ZaC2dkwOQCB6uH7Hdzf2UB67vvL5mrpZ3Vii8Pi6VxWM5psmgXzDw0pz5fVRlWbNpa5RFnjAtat_7rbzhL5UurWIWTvRlKXsg9psgo11Raulbfj_t4IPw_zEuVJ_1Wo69M15MyxYLbCXbSIHSkglpRrbYPzQdyhqJ5h_R35S0jeq1-oy6z4852QcD1RRLt09ktQTGfUdKDjU0fCOpqzJBSDFY2cOL91oEwZZ73H2x4zuvtAeIILliPY13ZZr_SJniu6_Mq9L5h",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuANcI4V4RoBP42ykcfN2li_uBWXeW_dGv1X8QD1ronytSb_Jyq1smIya7Q21AHuQi4vBTCKcxp78-nYWlPewjD64x36fciaq8jRqY8wOJNR8INBDzLJZb36cneWPN0ATZitjJppgpp2GDzDeEMnFezw1Sgg5XAbd-92nthezjITx8DP5qE9TZz3pgA4JCSqzm2wK8HILpXHCl1vez5YvWOMQm1EbGx8QYzeCNa6FB5D8aMDC56fkjf0Gsjj5ItqhUW3tv1N8lpAx4mJ"
  ],
  CHECKOUT_THUMB: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsbLfdzkeETBn9rxYQ_PqiKgW0iwRisn1KQBAmOrCxvddIoHaJzvqeKFtfhhflwhK8CMBGuqnKXZMiT3m1a6VXuR0H1EsjC4qIvlOyCt50kXjHTa6l8k0sEWRqngwr1fuN0GBE8n9Q_P-nhtzPVClAzAqgNu1EkamLRFPHPu-_ojZtYWmiEJbztZifg4T31Ovdu_GPeoDrUqAr0-_iRjv8hEg0p2Xw-8hhtL3gBExj6vNx_HtZAHgCwMFoDm5_4ImLqgc7eRjiHVYM",
  SUCCESS_HERO: "https://lh3.googleusercontent.com/aida-public/AB6AXuBl1VUlXKq7BcSITAqdM0jqy1gJF_lecKpFBlUzERV9vXYdHYwunt7qc7_afjYc5msPaFa9xvRx6hl3uu-ld64B4ufxvHCxBlS3xb803US2B-qx_Jl1U4kkiiXVp5evk9BlDlqyARVKweMOSETSmZavM5Sqj4wOLO-DvPYrh686dOIfoRsTz_V0FJxdO_62V0alEuram_5N_oz_vo3VmDzqpkCNejvBMD1Yl1iswmj9eysdMrkb0mWl2ZV-ZwXpbiWRB2MjgzZz8U2G",
  TRACK_ORDER_THUMB: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkyr8xJVCrALifFFwxOF-axnJvsUtwO6atsrhHlJPehfw22eHsyWKiVtWeze1mrfVAGMQW-CXdpa8qRTR-kd6YgdiGl1mhzNA8zbZ3BBH8OpvacAMU5GIJhQ-xTMRFTB38p4qJjNqWN477WLgRhmKQqbFCdXZeC4qyV0GI8oAWeaEBugSG0EFtR1XFbidJSUNB3iQJWd6_amHFwU5AFcC-wm-q-wq62vdpusuAOLTwTmeSDXE9qx5HdrR4VT7XU1I14tt-wDolyqIe",
  PROMO_SOCKS: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQGqrdPxHpS7Yrxt0qVMevu3MTzb-0W0It16y2K1Tz6saYxPUmH7wlFCK7FcBoLBD804mhP4k9eN4_fMTgtHDdrHLIfGn337pQLnIgCpbWTvFbbYJPHBlUgDVdqiaAcjRoJZAbRd7mpul27dCP5bd1MlVfVR3C4tJUTKVQIO6xYFMZXg050Og3Y9Nyjak_dCmqmUmvHcR2AyzyH7Ch4U-ujjwqLlGizgMhuCxrS5hXg8DBLF59qC6rxZc-gAyfdEQGJccQuh1SgMDn"
};