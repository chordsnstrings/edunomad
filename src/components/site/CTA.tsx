import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="bg-navy">
      <Container className="py-16 text-center sm:py-20">
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold text-white sm:text-4xl">
          Your university journey starts with one message.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70">
          Build your profile in ten minutes and see where you can go. It&apos;s
          free to start.
        </p>
        <div className="mt-8">
          <Link href="#contact" className={buttonClasses("gold", "lg")}>
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
