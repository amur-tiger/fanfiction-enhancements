import clsx from "clsx";
import classes from "./Rating.css";

const ratings: Record<string, { class: string; title: string } | undefined> = {
  K: {
    class: classes.ratingK,
    title: "General Audience (5+)",
  },
  "K+": {
    class: classes.ratingKp,
    title: "Young Children (9+)",
  },
  T: {
    class: classes.ratingT,
    title: "Teens (13+)",
  },
  M: {
    class: classes.ratingM,
    title: "Teens (16+)",
  },
  MA: {
    class: classes.ratingMa,
    title: "Mature (18+)",
  },
};

export interface RatingProps {
  rating?: string;
}

export default function Rating({ rating }: RatingProps) {
  return (
    <a
      href="https://www.fictionratings.com/"
      class={clsx(classes.rating, ratings[rating ?? ""]?.class)}
      title={ratings[rating ?? ""]?.title ?? "No Rating Available"}
      rel="noreferrer"
      target="rating"
    >
      {rating && rating in ratings ? rating : "?"}
    </a>
  );
}
