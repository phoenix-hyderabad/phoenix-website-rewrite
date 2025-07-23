"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const Thriveforce = () => {
  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-col gap-8 p-8">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col gap-4">
          <h1 className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            THRIVEFORCE
          </h1>
          <p className="text-xl text-muted-foreground md:text-2xl">
            Combat Robotics Team
          </p>
          <div className="mx-auto w-fit bg-red-500 text-white px-4 py-2 rounded-full text-lg font-semibold">
            🏆 Multiple Prize Winners
          </div>
        </div>
        
        <div className="relative w-full max-w-4xl">
          <Image
            src="https://phoenix-bphc.vercel.app/linefol/thriveforceimg.jpg"
            alt="Thriveforce Robot"
            width={800}
            height={400}
            className="rounded-lg object-cover w-full h-auto shadow-2xl"
            priority
          />
        </div>
      </section>

      <div className="my-8 h-px bg-border"></div>

      {/* About Section */}
      <section className="grid gap-8 md:grid-cols-2">
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⚔️</span>
              What is Thriveforce?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Thriveforce is PHoEnix&apos;s premier combat robotics team, specializing in 
              building powerful and strategic robots for competitive combat events.
            </p>
            <p className="text-muted-foreground">
              Our team combines engineering excellence with innovative design to create 
              robots that dominate in the arena of destruction and strategy.
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              Robowars Combat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Robowars is an event of destruction and madness where robots battle 
              it out to claim victory over their opponents.
            </p>
            <p className="text-muted-foreground">
              Teams design and build combat robots that engage in intense battles, 
              testing both engineering prowess and strategic thinking.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Achievements Section */}
      <section className="space-y-6">
        <h2 className="text-center text-3xl font-bold">🏆 Our Achievements</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
            <CardHeader>
              <CardTitle className="text-center text-yellow-700 dark:text-yellow-400">
                IIT Bombay
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold">🥇</div>
              <p className="text-muted-foreground">Prize Winner</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardHeader>
              <CardTitle className="text-center text-blue-700 dark:text-blue-400">
                BITS Pilani
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold">🏆</div>
              <p className="text-muted-foreground">Prize Winner</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardHeader>
              <CardTitle className="text-center text-purple-700 dark:text-purple-400">
                Multiple Colleges
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold">🎯</div>
              <p className="text-muted-foreground">Consistent Performance</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Combat Arena Section */}
      <section className="space-y-6">
        <h2 className="text-center text-3xl font-bold">⚡ The Combat Arena</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">🔧</span>
                Design & Engineering
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">•</span>
                  Advanced mechanical design for maximum impact
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">•</span>
                  Precision control systems for tactical advantage
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">•</span>
                  Robust armor and defensive mechanisms
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">•</span>
                  Innovative attack strategies and weapon systems
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">⚔️</span>
                Battle Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-red-500">•</span>
                  Aggressive offensive maneuvers
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">•</span>
                  Defensive positioning and counter-attacks
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">•</span>
                  Real-time adaptation to opponent strategies
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">•</span>
                  Endurance and sustainability in combat
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Spirit Section */}
      <section className="text-center space-y-6">
        <h2 className="text-3xl font-bold">🔥 The Thriveforce Spirit</h2>
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/10 dark:to-orange-950/10">
          <CardContent className="p-8">
            <blockquote className="text-lg italic text-muted-foreground">
              &ldquo;In the arena of combat robotics, we don&apos;t just build machines - we craft 
              warriors. Every bolt tightened, every circuit designed, and every strategy 
              planned reflects our unwavering commitment to excellence and innovation.&rdquo;
            </blockquote>
            <p className="mt-4 font-semibold">- Team Thriveforce</p>
          </CardContent>
        </Card>
      </section>

      {/* Join Us Section */}
      <section className="text-center space-y-6">
        <h2 className="text-3xl font-bold">🚀 Join the Battle</h2>
        <Card className="border-2 border-dashed border-orange-300 dark:border-orange-700">
          <CardContent className="p-8 space-y-4">
            <p className="text-lg text-muted-foreground">
              Are you ready to enter the world of combat robotics?
            </p>
            <p className="text-muted-foreground">
              Join PHoEnix and become part of the Thriveforce legacy. Whether you&apos;re 
              interested in mechanical design, electronics, programming, or strategy, 
              there&apos;s a place for you in our combat robotics team.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="px-2 py-1 bg-muted rounded text-sm">Mechanical Design</span>
              <span className="px-2 py-1 bg-muted rounded text-sm">Electronics</span>
              <span className="px-2 py-1 bg-muted rounded text-sm">Programming</span>
              <span className="px-2 py-1 bg-muted rounded text-sm">Strategy</span>
              <span className="px-2 py-1 bg-muted rounded text-sm">CAD Design</span>
              <span className="px-2 py-1 bg-muted rounded text-sm">Control Systems</span>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Thriveforce;
