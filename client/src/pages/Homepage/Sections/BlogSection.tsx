import BlogCard from "../../../components/BlogCard/BlogCard";
import { Blogs as blogData } from "../../../utils";

function BlogSection() {
  const Blogs: any = blogData;

  return (
    <div className="max-w-[1280px] mx-auto mb-14 mt-10 px-4">
      <div className="text-center mb-7 relative">
        <h2 className="text-4xl font-bold text-neutral-900 mb-4 animate__animated animate__fadeIn">
          Blogs
        </h2>
        <div className="w-24 h-1 bg-blue-600 mx-auto relative overflow-hidden">
          <div className="absolute h-full w-full bg-blue-400 animate-slide"></div>
        </div>
      </div>
      <p className="text-center mb-10 text-neutral-600 text-lg">
        Explore insights and ideas to make your events successful.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Blogs.map((blog: any, index: number) => (
          <div key={index} className="flex justify-center">
            <BlogCard
              id={blog.id}
              title={blog.title}
              description={blog.description[0].content}
              imageURL={blog.imageURL}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogSection;
