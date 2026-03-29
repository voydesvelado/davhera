export default function Home() {
  return (
    <section className="bg-surface-container-low py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
          <div className="space-y-4">
            <span className="font-manrope uppercase tracking-[0.2em] text-[10px] text-primary font-bold">New Arrivals</span>
            <h2 className="text-on-background font-headline font-bold text-4xl tracking-tight">Summer 24 Edit</h2>
          </div>
          <div className="flex gap-8 border-b border-outline-variant/20 pb-2">
            <button className="text-xs font-label uppercase tracking-widest text-on-background font-semibold">All</button>
            <button className="text-xs font-label uppercase tracking-widest text-on-surface-variant">Objects</button>
            <button className="text-xs font-label uppercase tracking-widest text-on-surface-variant">Linen</button>
            <button className="text-xs font-label uppercase tracking-widest text-on-surface-variant">Aroma</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
          {/* Product Card 1 */}
          <div className="group cursor-pointer">
            <div className="aspect-[3/4] bg-surface-container-lowest rounded-lg overflow-hidden mb-6 relative">
              <img
                alt="white linen shirt"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVyFGe-D-isk2Qw5dGdXVKcmPJtYnjcLelr61-Yi7Hqo32Gtz9QM2HL2WzpsXJzjQIDZWM3zzel4ok2aSzeE526XhNLjU6XEHKpMlLJXviH-1cTTJ2I4wGT6R5pGfeaja83MO9Mnyfjt48kbmd20GODDi7Bnco8qvJ5uN_vmaUxjspSwC28Wc8tcFoncxp9P5G3yIYsIXFiyc-Jv1uAug4NGyjHp74H9_2KjFw5R2sH0rd6Ajrho2yHaMpaQGwx3L7oqfrZ563cNk"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-stone-900 text-stone-50 text-[10px] font-bold uppercase tracking-widest px-2 py-1">Limited</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-headline font-bold text-lg text-on-background group-hover:text-primary transition-colors">The Raw Linen Shirt</h3>
                <span className="text-on-surface-variant font-body text-sm font-medium">$185</span>
              </div>
              <p className="text-on-surface-variant font-body text-xs uppercase tracking-widest">Off-White / 100% Organic</p>
            </div>
          </div>
          {/* Product Card 2 */}
          <div className="group cursor-pointer">
            <div className="aspect-[3/4] bg-surface-container-lowest rounded-lg overflow-hidden mb-6 relative">
              <img
                alt="minimalist coffee table"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmpieCqqT6RKCzi5dwE-sK0ZAkUmui4ScIaXhrS2en8psBrD2OdN-7KxlQoccogNIrPzTHB5FHLVE6DZStX7BU0ioKPK8tVsOsmTVt_Tf5kbONNf70G4iGD2KuQUlI-7QJJJmTIFMphe3d1TQRJZFzribL8_s8AurBNK7CLx4L0Vh6m2xa-hkacIVfAaB9jGRxP7Y15gNLp1h6H0A0sqxBcrag3TPUaPi-ekfv2AMQGc6UQxOpaS3SsjLOEABF3aK4F5MPiVBh_KY"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-headline font-bold text-lg text-on-background group-hover:text-primary transition-colors">Sculptural Low Table</h3>
                <span className="text-on-surface-variant font-body text-sm font-medium">$840</span>
              </div>
              <p className="text-on-surface-variant font-body text-xs uppercase tracking-widest">Solid Oak / Hand-Finished</p>
            </div>
          </div>
          {/* Product Card 3 */}
          <div className="group cursor-pointer">
            <div className="aspect-[3/4] bg-surface-container-lowest rounded-lg overflow-hidden mb-6 relative">
              <img
                alt="botanical perfume"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxoF94C2A2klcEQ_HTYlXeE7na1LmxQkxlsajvU65Ow7it5IHzyf1IjWk8t4xrd2_Wv-FegbTMJUNmr91uhgjG8nAJxc90Lrp5KvSz4MObNf5awT72Olp-xXDuwdinuIVGKSOXmRslGGArvumKqssT-wCa-NAMH97-x8GsnzO9WgOmtTzZVWMMk0fhaH2hDxUKyCHGZqbyOw1UAnoauEQxURuQsDztggUqBvOaH1lKqizB39oPxRi2MkZZNwt0AJqGFy9uU9YqO-s"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-headline font-bold text-lg text-on-background group-hover:text-primary transition-colors">Dusk Botanical Extract</h3>
                <span className="text-on-surface-variant font-body text-sm font-medium">$145</span>
              </div>
              <p className="text-on-surface-variant font-body text-xs uppercase tracking-widest">50ml / Sandalwood & Fig</p>
            </div>
          </div>
          {/* Product Card 4 */}
          <div className="group cursor-pointer">
            <div className="aspect-[3/4] bg-surface-container-lowest rounded-lg overflow-hidden mb-6 relative">
              <img
                alt="ceramic bowl"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3kiwNFz4idCCP85EMxdUl00IptXN57GyLBqY97OnlXa5Ay-iagccW9InyNmiOivwumnjuY5YK9zdz7m9j3zurzFn6HbHLtVAFBuXz80tLfdEse7dFuN1JaHAMmINo0TNuCXRaaorKeJ3-U_35visT4N1jY5tkY15EEGB6DMviOrdl9_-TOEcOHFQDuBzo9xdpY20Yaz5zUtMH5dBqpHs_U15ZWTOWOffeBMGu4_5UMVrx92N0yZ6hHxFACVefzJr5KjWbLRFodYY"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-headline font-bold text-lg text-on-background group-hover:text-primary transition-colors">Obsidian Breakfast Set</h3>
                <span className="text-on-surface-variant font-body text-sm font-medium">$95</span>
              </div>
              <p className="text-on-surface-variant font-body text-xs uppercase tracking-widest">Matte Stoneware / Set of 3</p>
            </div>
          </div>
          {/* Product Card 5 */}
          <div className="group cursor-pointer">
            <div className="aspect-[3/4] bg-surface-container-lowest rounded-lg overflow-hidden mb-6 relative">
              <img
                alt="leather journal"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmG1XJ47i3sHYwUFq5qd3c0tSRpq1W19M7Sp9rj2zE3hJoArRVBnp_cfxNU_SBZ5zb6eQb7aUOpsyIHyrr6GgJcAvKfYJe8Y2f-0sLVLuIf7jH5Sq3afinXC3Ur0K9o9UcEC6Gh37-FlcnoFN3wcYpI1IJ5JPLIbG5q7TwQfnjhtf7JRFkSHviLcorAyn6QWOAdPqvF9drS3cUtWDvvrkKLOuQZrt_q7snZCbs5QL78mLVvTuHx_5S6nomPvf4Lqz_ktYnPs-aSQ8"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-headline font-bold text-lg text-on-background group-hover:text-primary transition-colors">The Archivist Journal</h3>
                <span className="text-on-surface-variant font-body text-sm font-medium">$65</span>
              </div>
              <p className="text-on-surface-variant font-body text-xs uppercase tracking-widest">Vegetable Tanned Leather</p>
            </div>
          </div>
          {/* Product Card 6 */}
          <div className="group cursor-pointer">
            <div className="aspect-[3/4] bg-surface-container-lowest rounded-lg overflow-hidden mb-6 relative">
              <img
                alt="architectural lamp"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVGIlY1pj74xtKKAmpZ5GOcSMII3GiPTbLmAOdebNRaedrY-Mbz4hj_JPQGhDP-4XjsqdfcdoZOXvomQGk25XA8rb5V55f5qAoL9Vysq_jGU4yOwYiWVtedQNP_I19F6AHN2eIlfNg84YQB3Q4lgJQTyeW5eSbOnxPWSjSRPAqyBajEfifF9G0t3-lwksQeG6WEAmau0zL2Elk4-TcAaeAYuCv2v-_VWLR1wvuCUk8djw9Bc6hDhQcHJKxxuqc83Yt0u_K6om8gHY"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-headline font-bold text-lg text-on-background group-hover:text-primary transition-colors">Linear Brass Floor Lamp</h3>
                <span className="text-on-surface-variant font-body text-sm font-medium">$420</span>
              </div>
              <p className="text-on-surface-variant font-body text-xs uppercase tracking-widest">Architectural Series / Dimmable</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
