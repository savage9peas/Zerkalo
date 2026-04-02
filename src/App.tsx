/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Hero from "./components/Hero";
import Story from "./components/Story";
import Product from "./components/Product";
import CTA from "./components/CTA";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import CheckoutModal from "./components/CheckoutModal";
import { GlassFilter } from "./components/ui/liquid-glass";

export default function App() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <main className="min-h-screen bg-ivory font-sans text-ink selection:bg-gold selection:text-ivory">
      <GlassFilter />
      <Hero onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <Story />
      <Product />
      <CTA onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <FAQ />
      <Footer />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </main>
  );
}
