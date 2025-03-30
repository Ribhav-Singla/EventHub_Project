import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";

function EventCard({
  title,
  description,
  imageURL
}: {
  title: string;
  description: string;
  imageURL:string
}) {
  return (
    <div>
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            sx={{
              height: 200,
              objectFit: "cover",
            }}
            image={imageURL}
            className="text-center"
            alt="Event Image"
          />
          <CardContent>
            <div className="flex gap-5">
              <div>
                <p className="text-blue-600 font-semibold text-sm">APR</p>
                <p className="text-2xl font-bold">14</p>
              </div>
              <div>
                <p className="text-md font-semibold">
                  {title}
                </p>
                <p className="text-sm">
                  {description.length > 71
                    ? description.slice(0, 71) + "..."
                    : description}
                </p>
              </div>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}

export default EventCard;
