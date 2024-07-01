import Link from 'next/link';

import { Separator } from '@/components/ui/separator';

export default function About() {
  return (
    <div className="flex flex-col self-center gap-4 p-8 md:p-20 pt-4 md:pt-8 max-w-6xl 2xl:max-w-7xl w-full">
      <h1 className="self-center text-center font-semibold text-3xl md:text-4xl">
        The Doomsday Diary
      </h1>
      <p>
        The Doomsday Diary is our submission for the Onchain Summer Buildathon,
        backed by Coinbase to inspire creativity and community engagement all
        summer long. Created by the $DOOMER community, we&apos;re competing in
        the Social track, aiming to create a viral onchain social experience.
      </p>
      <Separator />
      <h2 className="self-center text-center font-semibold text-2xl md:text-3xl">
        What is The Doomsday Diary?
      </h2>
      <p>
        The Doomsday Diary is an online forum where users share their doom
        stories—moments when everything seemed to go wrong. Whether it&apos;s a
        crypto misadventure or a life&apos;s pitfall, these entries allow
        authors to recount their experiences, share lessons learned, and connect
        with others who have faced similar challenges. Through this project and
        platform, we hope to build camaraderie, empathy, and trust within our
        community.
      </p>
      <Separator />
      <h2 className="self-center text-center font-semibold text-2xl md:text-3xl">
        Why Are We Doing This?
      </h2>
      <p>
        The Doomsday Diary aligns perfectly with the $DOOMER ethos of learning
        from adversity and growing through shared experiences. This platform
        helps users connect over shared challenges and learn from each
        other&apos;s mistakes and successes, strengthening our community.
      </p>
      <Separator />
      <h2 className="self-center text-center font-semibold text-2xl md:text-3xl">
        How Does It Work?
      </h2>
      <ul className="list-disc pl-6">
        <li>
          Posting Stories: Users can post their doom stories anonymously or
          under their Coinbase username.
        </li>
        <li>
          Reactions: Readers can engage with posts using one of the five
          available reactions.
        </li>
        <li>
          Secure Login: To post or react, users need to log in through the
          Coinbase login flow. This ensures secure and verified interactions
          while keeping Coinbase funds unconnected. Users can choose to remain
          anonymous or display their username when posting.
        </li>
        <li>
          Optional Wallet Display: Posters can include their Ethereum wallet
          address, allowing readers to view the wallet&apos;s BaseScan page or
          send donations if they wish.
        </li>
      </ul>
      <Separator />
      <p>
        Join us in sharing, learning, and building a stronger community through
        The Doomsday Diary. By sharing our doom stories, we build a resilient
        community that embraces the harsh realities of life and crypto. J
        Together, we can turn our moments of doom into opportunities for growth
        and connection. Join us in turning gloom into gold.
      </p>
      <Separator />
      <p>Learn More About $DOOMER:</p>
      <ul className="list-disc pl-6">
        <li>
          <Link
            className="text-blue-500 dark:text-blue-400"
            href="https://doomercto.xyz"
          >
            🔗 Visit our website
          </Link>
        </li>
        <li>
          <Link
            className="text-blue-500 dark:text-blue-400"
            href="https://t.me/doomercto"
          >
            🔗 Join our community chat
          </Link>
        </li>
        <li>
          <Link
            className="text-blue-500 dark:text-blue-400"
            href="https://twitter.com/doomeronbasecto"
          >
            🔗 Follow us on Twitter
          </Link>
        </li>
      </ul>
    </div>
  );
}
