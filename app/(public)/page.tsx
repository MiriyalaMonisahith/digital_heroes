import Link from "next/link";
import Image from "next/image";
import { getFeaturedCharities } from "@/lib/data/charities";
import { LinkButton } from "@/components/ui/Button";
import { Card, CardDark } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/marketing/Reveal";

const whatYouDo = [
  {
    tag: "Engine",
    title: "Subscribe",
    body: "Pick a monthly or yearly plan. Part of every subscription goes straight to your charity.",
  },
  {
    tag: "Experience",
    title: "Log your rounds",
    body: "Enter your last five Stableford scores in a couple of taps — that's it, no spreadsheets.",
  },
  {
    tag: "Engine",
    title: "You're in the draw",
    body: "Your scores become your numbers. Every month we draw five — match them, win a share of the pool.",
  },
  {
    tag: "Integration",
    title: "Your charity wins too",
    body: "A minimum of 10% of your subscription goes to a cause you choose, win or lose.",
  },
];

const tiers = [
  { tier: "5", label: "Five-number match", share: "40%", note: "Jackpot — rolls over if unclaimed" },
  { tier: "4", label: "Four-number match", share: "35%", note: "Split evenly among winners" },
  { tier: "3", label: "Three-number match", share: "25%", note: "Split evenly among winners" },
];

export default async function HomePage() {
  const featuredCharities = await getFeaturedCharities();

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-[-10%] h-96 w-96 rounded-full bg-sage-100 blur-3xl" />
        <div className="pointer-events-none absolute top-40 left-[-10%] h-72 w-72 rounded-full bg-amber-400/30 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <Reveal>
            <Badge tone="sage">Golf performance · Charity draw</Badge>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 max-w-3xl font-display text-4xl leading-[1.1] text-charcoal-900 sm:text-6xl">
              Every round you play <em className="italic text-sage-500">gives back.</em>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal-700">
              Track your Stableford scores, get automatically entered into a monthly
              prize draw, and send part of your subscription to a charity you care
              about. One platform, no fairway clichés.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <LinkButton href="/signup" variant="accent" size="lg">
                Start playing
              </LinkButton>
              <LinkButton href="#how-it-works" variant="outline" size="lg">
                See how it works
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT YOU DO */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whatYouDo.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <Card className="h-full">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                  {item.tag}
                </p>
                <p className="mt-3 font-display text-xl text-charcoal-900">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-500">{item.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="From tee to"
            italic="trophy."
            description="Four steps between signing up and your charity — and maybe you — winning something back."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {[
            "Subscribe monthly or yearly and choose the charity you're playing for.",
            "Enter your latest Stableford scores — we keep your most recent five.",
            "Those five scores become your numbers for that month's draw, automatically.",
            "We draw five numbers a month. Match three, four or five to win a share of the pool.",
          ].map((step, i) => (
            <Reveal key={step} delay={i * 0.05}>
              <div className="flex gap-4 rounded-2xl border border-border bg-cream-card p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-600 font-display text-sm text-cream">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-charcoal-700">{step}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* THE DRAW */}
      <section id="draws" className="bg-pine-900 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <SectionHeading
              eyebrow="The monthly draw"
              title="Three ways to"
              italic="win."
              description="Every subscription contributes to the pool. Distribution is fixed and automatic — the more of your numbers match, the bigger your share."
              tone="dark"
            />
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {tiers.map((t, i) => (
              <Reveal key={t.tier} delay={i * 0.05}>
                <CardDark>
                  <p className="font-display text-4xl text-amber-400">{t.tier}</p>
                  <p className="mt-3 text-base text-cream">{t.label}</p>
                  <p className="mt-4 text-2xl font-display text-cream">{t.share}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-sage-300">
                    of pool · {t.note}
                  </p>
                </CardDark>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CHARITY SPOTLIGHT */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Charity spotlight"
              title="Play for a cause that"
              italic="matters to you."
              description="Every subscriber picks a charity at signup. Browse the full directory or get a taste below."
            />
            <LinkButton href="/charities" variant="outline">
              View all charities
            </LinkButton>
          </div>
        </Reveal>

        {featuredCharities.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {featuredCharities.map((charity, i) => (
              <Reveal key={charity.id} delay={i * 0.05}>
                <Link href={`/charities/${charity.slug}`}>
                  <Card className="h-full transition-transform hover:-translate-y-1">
                    <div className="relative mb-4 h-32 w-full overflow-hidden rounded-xl bg-sage-100">
                      {charity.image_url && (
                        <Image
                          src={charity.image_url}
                          alt={charity.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <p className="font-display text-lg text-charcoal-900">{charity.name}</p>
                    <p className="mt-1 text-sm text-charcoal-500">{charity.tagline}</p>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-cream-card px-6 py-12 text-center text-sm text-charcoal-500">
            Charities will appear here once the platform is connected to its database —
            see the charity directory for the full list.
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-sage-600 px-8 py-14 text-center sm:px-16">
            <div className="pointer-events-none absolute -top-10 -right-10 h-56 w-56 rounded-full bg-amber-400/30 blur-3xl" />
            <h2 className="relative font-display text-3xl text-cream sm:text-4xl">
              Ready to play <em className="italic text-amber-400">your</em> round?
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-cream/80">
              Subscribe in a couple of minutes, log your scores, and you&rsquo;re in the
              next draw — no experience necessary.
            </p>
            <div className="relative mt-8">
              <LinkButton href="/signup" variant="accent" size="lg">
                Get started
              </LinkButton>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
