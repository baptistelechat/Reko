"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MOODS_ARRAY } from "@/constants/moods";
import { motion } from "framer-motion";
import { Clock, Film, Heart, Play, Sparkles, Star, Tv } from "lucide-react";
import Link from "next/link";

const LandingPage = () => {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Recommandations Intelligentes",
      description:
        "Découvrez des films et séries parfaitement adaptés à votre humeur du moment",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Adapté à Votre Temps",
      description:
        "Trouvez le contenu idéal selon le temps libre dont vous disposez",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Watchlist Personnalisée",
      description:
        "Sauvegardez vos découvertes et créez votre liste de favoris",
    },
  ];

  const moods = MOODS_ARRAY.map(mood => ({
    emoji: mood.emoji,
    name: mood.label,
    color: mood.bgColor
  }));

  return (
    <div>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Découvrez votre{" "}
            <span className="bg-linear-to-r  from-primary to-orange-500 bg-clip-text text-transparent">
              prochaine obsession
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            REKO vous recommande des films et séries basés sur votre humeur,
            votre temps libre et vos préférences du moment.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/explore">
              <Button
                size="lg"
                className="bg-linear-to-r from-primary to-orange-500 text-white px-8 py-4 text-lg hover:scale-105"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Commencer l'exploration
              </Button>
            </Link>

            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              <Play className="w-5 h-5 mr-2" />
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
          <p className="text-gray-500 mb-6">
            Choisissez votre humeur du moment
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
            {moods.map((mood, index) => (
              <motion.div
                key={mood.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Badge
                  variant="secondary"
                  className={`${mood.color} px-4 py-2 text-sm cursor-pointer hover:scale-105 transition-transform w-full justify-center`}
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
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trois étapes simples pour découvrir votre prochaine pépite
            cinématographique
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="text-center p-6 h-full transition-all hover:-translate-y-1 hover:shadow-xl border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-linear-to-br  from-primary to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
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
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Films &amp; Séries
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explorez une vaste collection de contenus adaptés à tous les goûts
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <Card className="h-full p-8 transition-all hover:-translate-y-1 hover:shadow-xl border-0 shadow-lg bg-linear-to-br from-violet-50 to-violet-100">
              <CardContent className="pt-0 h-hull">
                <div className="flex items-center mb-4">
                  <Film className="w-8 h-8 text-violet-600 mr-3" />
                  <h3 className="text-2xl font-bold text-violet-800">Films</h3>
                </div>
                <p className="text-violet-700 mb-4">
                  Des blockbusters aux films d'auteur, découvrez des œuvres
                  cinématographiques qui correspondent parfaitement à votre état
                  d'esprit.
                </p>
              </CardContent>
                <CardFooter>
                  <div className="flex items-center text-sm text-violet-600">
                  <Star className="w-4 h-4 mr-1" />
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
            <Card className="h-full p-8 transition-all hover:-translate-y-1 hover:shadow-xl border-0 shadow-lg bg-linear-to-br from-orange-50 to-orange-100">
              <CardContent className="pt-0 h-full">
                <div className="flex items-center mb-4">
                  <Tv className="w-8 h-8 text-orange-500 mr-3" />
                  <h3 className="text-2xl font-bold text-orange-800">Séries</h3>
                </div>
                <p className="text-orange-500 mb-4">
                  Plongez dans des univers captivants avec des séries
                  soigneusement sélectionnées selon votre temps disponible et
                  vos envies.
                </p>

              </CardContent>
          <CardFooter>                <div className="flex items-center text-sm text-orange-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Adaptées à votre planning</span>
                </div></CardFooter>
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
          <Card className="max-w-2xl mx-auto p-8 bg-linear-to-br  from-primary to-orange-500 text-white border-0 shadow-2xl">
            <CardContent className="pt-0">
              <h2 className="text-3xl font-bold mb-4">
                Prêt à découvrir votre prochaine obsession ?
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Rejoignez des milliers d'utilisateurs qui ont déjà trouvé leurs
                films et séries préférés grâce à REKO.
              </p>
              <Link href="/explore">
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 py-4 text-lg font-semibold"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
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
          <p>&copy; 2025 REKO. Découvrez, regardez, recommencez. Créé par <span className="text-primary font-bold">Baptiste LECHAT</span></p>
        </motion.div>
      </footer>
    </div>
  );
};

export default LandingPage;
