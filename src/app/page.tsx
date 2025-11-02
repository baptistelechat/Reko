"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MOODS_ARRAY } from "@/constants/moods";
import { motion } from "framer-motion";
import { Clock, Film, Heart, Play, Sparkles, Star, Tv } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();
  const features = [
    {
      icon: <Sparkles className="size-8" />,
      title: "Recommandations Intelligentes",
      description:
        "Découvrez des films et séries parfaitement adaptés à votre humeur du moment",
    },
    {
      icon: <Clock className="size-8" />,
      title: "Adapté à Votre Temps",
      description:
        "Trouvez le contenu idéal selon le temps libre dont vous disposez",
    },
    {
      icon: <Heart className="size-8" />,
      title: "Watchlist Personnalisée",
      description:
        "Sauvegardez vos découvertes et créez votre liste de favoris",
    },
  ];

  const moods = MOODS_ARRAY.map((mood) => ({
    emoji: mood.emoji,
    name: mood.label,
    color: mood.bgColor,
    id: mood.id,
  }));

  const handleMoodClick = (moodId: string) => {
    router.push(`/explore?mood=${moodId}&step=1`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl"
        >
          <h1 className="mb-6 text-5xl font-bold md:text-7xl">
            Découvrez votre{" "}
            <span className="bg-linear-to-r from-violet-300 to-orange-300 bg-clip-text text-transparent">
              prochaine obsession
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600 md:text-2xl">
            REKO vous recommande des films et séries basés sur votre humeur,
            votre temps libre et vos préférences du moment.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/explore">
              <Button
                size="lg"
                className="from-primary bg-linear-to-r to-orange-500 px-8 py-4 text-lg text-white hover:scale-105"
              >
                <Sparkles className="mr-2 size-5" />
                Commencer l'exploration
              </Button>
            </Link>

            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              <Play className="mr-2 size-5" />
              Voir la démo
            </Button>
          </motion.div>
        </motion.div>

        {/* Mood Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16"
        >
          <p className="mb-6 text-gray-500">
            Choisissez votre humeur du moment
          </p>
          <div className="mx-auto grid max-w-lg grid-cols-3 gap-3">
            {moods.map((mood, index) => (
              <motion.div
                key={mood.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Badge
                  variant="secondary"
                  className={`${mood.color} w-full cursor-pointer justify-center px-4 py-2 text-sm transition-transform hover:scale-105`}
                  onClick={() => handleMoodClick(mood.id)}
                >
                  <span className="mr-2">{mood.emoji}</span>
                  {mood.name}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Comment ça marche ?
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Trois étapes simples pour découvrir votre prochaine pépite
            cinématographique
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 p-6 text-center shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
                <CardContent className="pt-6">
                  <div className="from-primary mx-auto mb-4  flex size-16 items-center justify-center rounded-full bg-linear-to-br to-orange-500 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Content Types Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Films &amp; Séries
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Explorez une vaste collection de contenus adaptés à tous les goûts
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <Card className="h-full border-0 bg-linear-to-br from-violet-50 to-violet-100 p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
              <CardContent className="h-hull pt-0">
                <div className="mb-4 flex items-center">
                  <Film className="mr-3 size-8 text-violet-600" />
                  <h3 className="text-2xl font-bold text-violet-800">Films</h3>
                </div>
                <p className="mb-4 text-violet-700">
                  Des blockbusters aux films d'auteur, découvrez des œuvres
                  cinématographiques qui correspondent parfaitement à votre état
                  d'esprit.
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex items-center text-sm text-violet-600">
                  <Star className="mr-1 size-4" />
                  <span>Recommandations personnalisées</span>
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <Card className="h-full border-0 bg-linear-to-br from-orange-50 to-orange-100 p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
              <CardContent className="h-full pt-0">
                <div className="mb-4 flex items-center">
                  <Tv className="mr-3 size-8 text-orange-500" />
                  <h3 className="text-2xl font-bold text-orange-800">Séries</h3>
                </div>
                <p className="mb-4 text-orange-500">
                  Plongez dans des univers captivants avec des séries
                  soigneusement sélectionnées selon votre temps disponible et
                  vos envies.
                </p>
              </CardContent>
              <CardFooter>
                {" "}
                <div className="flex items-center text-sm text-orange-500">
                  <Clock className="mr-1 size-4" />
                  <span>Adaptées à votre planning</span>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="from-primary mx-auto max-w-2xl border-0  bg-linear-to-br to-orange-500 p-8 text-white shadow-2xl">
            <CardContent className="pt-0">
              <h2 className="mb-4 text-3xl font-bold">
                Prêt à découvrir votre prochaine obsession ?
              </h2>
              <p className="mb-6 text-lg opacity-90">
                Rejoignez des milliers d'utilisateurs qui ont déjà trouvé leurs
                films et séries préférés grâce à REKO.
              </p>
              <Link href="/explore">
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 py-4 text-lg font-semibold"
                >
                  <Sparkles className="mr-2 size-5" />
                  Commencer maintenant
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-500">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p>
            &copy; 2025 REKO. Découvrez, regardez, recommencez. Créé par{" "}
            <span className="text-primary font-bold">Baptiste LECHAT</span>
          </p>
        </motion.div>
      </footer>
    </div>
  );
};

export default LandingPage;
