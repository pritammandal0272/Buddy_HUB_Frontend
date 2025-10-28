import cover_image from "./assets/Images/cover_image.webp";
import profile from "./assets/Images/profile.jpg";
import Cover_Image from "./assets/Images/cover_image.webp";
import story from "./assets/Images/story.jpg";
import story1 from "./assets/Images/story1.jpg";
import { Backend_Path } from "./Backend_Path.js";

const Story = () => {
  const StoryPost = [
    {
      profile_img: profile,
      status: Cover_Image,
      name: "Pritam Mandal",
    },
    {
      profile_img: profile,
      status: story,
      name: "Madhab Shit",
    },
    {
      profile_img: profile,
      status: story1,
      name: "Abhinandan Gayen",
    },
  ];
  return StoryPost;
};
export { Story };