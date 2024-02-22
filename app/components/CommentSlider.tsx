import { Scrollbar, FreeMode, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CommentCard from "./CommentCard";
import { Comment, Comments } from "@/types";
import { Button, Input } from "@nextui-org/react";
import useComment from "@/app/lib/firebase/useComment";
import { User } from "firebase/auth";
import toast from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import Filter from "bad-words";
interface Props {
  comments: Comments | null;
  mediatype: string;
  id: number;
  user: User | null;
}

const CommentSlider = ({ comments, mediatype, id, user }: Props) => {
  const filter = new Filter();
  const { send } = useComment();
  // Function to filter bad words
  const filterBadWords = (comment: string): boolean => {
    const words = comment.split(" ");
    for (let i = 0; i < words.length; i++) {
      if (filter.isProfane(words[i])) {
        return true;
      }
    }
    return false;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    let comment = formdata.get("comment");
    if (!comment) return;

    if (filterBadWords(comment as string)) {
      toast.error("Please do not use profanity");
    } else {
      send(comment as string, id, mediatype);
    }
  };

  return (
    <section className="fc light w-full items-start gap-5 overflow-hidden py-2">
      <div className="max-w-full overflow-x-hidden">
        <Swiper
          modules={[Scrollbar, FreeMode, Mousewheel]}
          freeMode={true}
          scrollbar={{ draggable: true, enabled: true }}
          spaceBetween={20}
          mousewheel={{ releaseOnEdges: true }}
          slidesPerView={"auto"}
        >
          <SwiperSlide className="!aspect-auto !h-auto !min-w-[initial]">
            {user && (
              <div className="fc dark h-full w-full min-w-[260px] cursor-pointer items-start justify-start gap-3 rounded-2xl bg-zinc-800 px-5 py-4">
                <form
                  onSubmit={handleSubmit}
                  className="fc h-full min-h-[160px] w-full items-start justify-between gap-3"
                >
                  <div className="fc w-full items-start gap-3">
                    <Input
                      name="comment"
                      placeholder="Add a comment"
                      variant="bordered"
                    />
                    <p className="text-xs text-zinc-300">
                      Posting as{" "}
                      <span className="font-bold">{user?.displayName}</span>
                    </p>
                  </div>
                  <div className="fr ">
                    <Button type="submit" color="primary">
                      Post
                    </Button>
                  </div>
                </form>
              </div>
            )}
            {!user && (
              <div className="fc dark h-full w-full min-w-[250px] cursor-pointer items-start justify-start gap-3 rounded-2xl bg-zinc-800 px-5 py-4">
                <div className="fc h-full w-full gap-3">
                  <p className="text-xs text-zinc-300">
                    You must be <span className="font-bold">logged in</span> to
                    comment
                  </p>
                </div>
              </div>
            )}
          </SwiperSlide>

          <AnimatePresence mode="wait">
            {comments && Object.keys(comments).length !== 0 ? (
              Object.keys(comments)
                .sort((a, b) => {
                  // createdAt: "2023-12-15T17:03:22.446Z"
                  const dateA = new Date(comments[a].createdAt);
                  const dateB = new Date(comments[b].createdAt);
                  return dateB.getTime() - dateA.getTime();
                })
                .map((key) => {
                  const comment = comments[key] as Comment;
                  return (
                    <SwiperSlide
                      key={comment.uuid}
                      className="dark !aspect-auto !h-auto !min-w-[initial]"
                    >
                      {/*  */}
                      <CommentCard comment={comment} user={user} />
                    </SwiperSlide>
                  );
                })
            ) : (
              <SwiperSlide className="dark !aspect-auto !h-auto !min-w-[initial]">
                <div className="fc h-full w-full min-w-[250px] cursor-grab items-start justify-start gap-3 rounded-2xl bg-zinc-800 px-5 py-4 active:cursor-grabbing">
                  <div className="fc h-full w-full gap-3">
                    <p className="text-xs text-zinc-300">No comments yet</p>
                  </div>
                </div>
              </SwiperSlide>
            )}
          </AnimatePresence>
        </Swiper>
      </div>
    </section>
  );
};

export default CommentSlider;
