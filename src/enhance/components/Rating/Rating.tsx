import clsx from "clsx";
import "./Rating.css";

const ratings: Record<string, { class: string; title: string } | undefined> = {
  K: {
    class: "ffe-rating-k",
    title: "General Audience (5+)",
  },
  "K+": {
    class: "ffe-rating-kp",
    title: "Young Children (9+)",
  },
  T: {
    class: "ffe-rating-t",
    title: "Teens (13+)",
  },
  M: {
    class: "ffe-rating-m",
    title: "Teens (16+)",
  },
  MA: {
    class: "ffe-rating-ma",
    title: "Mature (18+)",
  },
};

export interface RatingProps {
  rating: string;
}

export default function Rating({ rating }: RatingProps) {
  return (
    <a
      href="https://www.fictionratings.com/"
      class={clsx("ffe-rating", ratings[rating]?.class)}
      title={ratings[rating]?.title ?? "No Rating Available"}
      rel="noreferrer"
      target="rating"
    >
      {rating in ratings ? rating : "?"}
    </a>
  );
}
