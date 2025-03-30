import { useParams } from "react-router-dom";
import { Blogs } from "../../../utils";
import { useEffect, useState } from "react";
import Spinner2 from "../../../components/Spinner/Spinner2";
import NotFound from "../../../components/NotFound.tsx/NotFound";

function Blog() {
  const { blogId } = useParams<{ blogId: string }>();
  const blogData = Blogs.find((blog) => blog.id === Number(blogId));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fake_fetch = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(false);
    };
    fake_fetch();
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-neutral-100">
        <Spinner2 />
      </div>
    );
  }

  if (!blogData) {
    return <NotFound />;
  }

  return (
    <div>
      <section
        id="blogContent"
        className="min-h-screen flex items-center justify-center py-16 bg-gray-50 pt-32"
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <article className="prose lg:prose-xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              {blogData.title}
            </h1>

            {blogData.description.map((desc: any, index: number) => (
              <div key={index} className="mb-8">
                <p className="text-gray-700 mb-4">{desc.content}</p>
                {desc.imageURL ? (
                  <img
                    src={desc.imageURL}
                    alt={""}
                    className="w-full rounded-lg shadow-md"
                  />
                ) : (
                  ""
                )}
              </div>
            ))}
          </article>
        </div>
      </section>
    </div>
  );
}

export default Blog;
