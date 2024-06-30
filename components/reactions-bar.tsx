import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';

import {
  addReaction as addReactionRaw,
  removeReaction as removeReactionRaw,
} from '@/actions/reaction';

import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { toast } from './ui/use-toast';
import { ToastAction } from './ui/toast';

import type { Reaction } from '@/actions/getPosts';

async function addReaction(...args: Parameters<typeof addReactionRaw>) {
  try {
    const result = await addReactionRaw(...args);
    if (!result?.success) {
      throw new Error('Failed to add reaction');
    }
    return true;
  } catch (err) {
    return false;
  }
}

async function removeReaction(...args: Parameters<typeof removeReactionRaw>) {
  try {
    const result = await removeReactionRaw(...args);
    if (!result?.success) {
      throw new Error('Failed to remove reaction');
    }
    return true;
  } catch (err) {
    return false;
  }
}

export default function ReactionsBar({
  post_id,
  reactions: initialReactions = [],
}: {
  post_id: number;
  reactions?: Reaction[];
}) {
  const { data: session } = useSession();

  const [selectedReactions, setSelectedReactions] = useState<
    Reaction['name'][]
  >(
    initialReactions
      .filter(reaction => reaction.user_liked)
      .map(reaction => reaction.name)
  );

  const [reactionCounts, setReactionCounts] = useState(
    Object.fromEntries(
      initialReactions.map(reaction => [reaction.name, reaction.count])
    )
  );

  const handleReactionChange = (newReactions: Reaction['name'][]) => {
    if (!session?.user?.email) {
      toast({
        title: 'Log in to react',
        action: (
          <ToastAction altText="Log in" onClick={() => signIn('coinbase')}>
            Log in
          </ToastAction>
        ),
      });
      return;
    }
    if (newReactions.length > selectedReactions.length) {
      const newReaction = newReactions.find(
        reaction => !selectedReactions.includes(reaction)
      );
      if (newReaction) {
        setReactionCounts(oldCounts => {
          const newCounts = { ...oldCounts };
          newCounts[newReaction] ??= 0;
          newCounts[newReaction]++;
          return newCounts;
        });
        addReaction(post_id, newReaction).then(success => {
          if (!success) {
            setReactionCounts(oldCounts => {
              const newCounts = { ...oldCounts };
              newCounts[newReaction]--;
              return newCounts;
            });
            setSelectedReactions(oldReactions =>
              oldReactions.filter(reaction => reaction !== newReaction)
            );
          }
        });
      }
    } else if (newReactions.length < selectedReactions.length) {
      const removedReaction = selectedReactions.find(
        reaction => !newReactions.includes(reaction)
      );
      if (removedReaction) {
        setReactionCounts(oldCounts => {
          const newCounts = { ...oldCounts };
          newCounts[removedReaction] ??= 1;
          newCounts[removedReaction]--;
          return newCounts;
        });
        removeReaction(post_id, removedReaction).then(success => {
          if (!success) {
            setReactionCounts(oldCounts => {
              const newCounts = { ...oldCounts };
              newCounts[removedReaction]++;
              return newCounts;
            });
            setSelectedReactions(oldReactions => [
              ...oldReactions,
              removedReaction,
            ]);
          }
        });
      }
    }
    setSelectedReactions(newReactions);
  };

  return (
    <ToggleGroup
      type="multiple"
      className="basis-full"
      value={selectedReactions}
      onValueChange={handleReactionChange}
    >
      <ToggleGroupItem value="fire">
        🔥 {reactionCounts.fire ?? 0}
      </ToggleGroupItem>
      <ToggleGroupItem value="heart">
        ❤️ {reactionCounts.heart ?? 0}
      </ToggleGroupItem>
      <ToggleGroupItem value="laugh">
        😂 {reactionCounts.laugh ?? 0}
      </ToggleGroupItem>
      <ToggleGroupItem value="cry">
        😭 {reactionCounts.cry ?? 0}
      </ToggleGroupItem>
      <ToggleGroupItem value="bulb">
        💡 {reactionCounts.bulb ?? 0}
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
