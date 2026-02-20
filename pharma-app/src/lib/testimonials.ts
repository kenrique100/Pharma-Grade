import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Testimony {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  product: string;
  date: string;
};

interface TestimonialsStore {
  testimonials: Testimony[];
  addTestimony: (t: Omit<Testimony, "id" | "date">) => void;
}

const defaultTestimonials: Testimony[] = [
  {
    id: "1",
    name: "Jake M.",
    avatar: "",
    rating: 5,
    text: "Best quality products I've found. My Testosterone Enanthate arrived quickly and the results speak for themselves. Will definitely order again.",
    product: "Testosterone Enanthate 250",
    date: "2025-01-10",
  },
  {
    id: "2",
    name: "Sarah K.",
    avatar: "",
    rating: 5,
    text: "The Anavar quality is outstanding — better than anything I've tried before. Packaging was discreet and delivery was fast. 10/10 recommend!",
    product: "Anavar 10mg",
    date: "2025-01-14",
  },
  {
    id: "3",
    name: "Dmitri V.",
    avatar: "",
    rating: 5,
    text: "HGH 100IU kit exceeded my expectations. The recovery improvements have been remarkable. Pharma Grade truly lives up to its name.",
    product: "HGH 100IU",
    date: "2025-01-20",
  },
  {
    id: "4",
    name: "Lucas B.",
    avatar: "",
    rating: 4,
    text: "BPC-157 has been a game changer for my shoulder injury recovery. I noticed significant improvement within 2 weeks. Great service too.",
    product: "BPC-157 5mg",
    date: "2025-02-01",
  },
  {
    id: "5",
    name: "Maria T.",
    avatar: "",
    rating: 5,
    text: "Clenbuterol 40mcg worked exactly as expected. Excellent cutting compound. Support team was responsive when I had questions.",
    product: "Clenbuterol 40mcg",
    date: "2025-02-08",
  },
  {
    id: "6",
    name: "Ahmed R.",
    avatar: "",
    rating: 5,
    text: "Crypto payment process was super smooth. Love the privacy aspect. Products are always exactly as described. A trusted supplier.",
    product: "Deca 300",
    date: "2025-02-12",
  },
];

export const useTestimonialsStore = create<TestimonialsStore>()(
  persist(
    (set, get) => ({
      testimonials: defaultTestimonials,
      addTestimony: (t) => {
        const newT: Testimony = {
          ...t,
          id: Date.now().toString(),
          date: new Date().toISOString().split("T")[0],
        };
        set({ testimonials: [newT, ...get().testimonials] });
      },
    }),
    { name: "pharma-testimonials" }
  )
);
