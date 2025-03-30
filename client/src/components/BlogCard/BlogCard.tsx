import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import { useNavigate } from "react-router-dom";

function BlogCard({
  id,
  title,
  description,
  imageURL,
}: {
  id: number;
  title: string;
  description: string;
  imageURL: string;
}) {

  const navigate = useNavigate();

  return (
    <div onClick={()=>navigate(`/blog/${id}`)}>
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            sx={{
              height: 200,
              objectFit: "cover",
            }}
            src={imageURL}
            alt="Event Image"
          />
          <CardContent>
            <div>
              <p className="text-md font-semibold mb-3">
                {title.length > 80 ? title.slice(0, 80) + "..." : title}
              </p>
              <p className="text-sm mb-3">
                {description.length > 110
                  ? description.slice(0, 110) + "..."
                  : description}
              </p>
              <p className="text-sm text-gray-500">21 Dec - Ribhav Singla</p>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}

export default BlogCard;
