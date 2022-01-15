import Link from "next/link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import style from "./project-card.module.css";
const ProjectCard = (props) => {
  const { title, desc, image, route } = props.project;
  const formattedImage = `/images/${image}`;
  return (
    <Link href={route}>
      <Card sx={{ width: 350 }} className={style.card}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="200"
            image={formattedImage}
            alt={title}
          />
          <CardContent>
            <Typography gutterBottom variant="h4" component="div">
              {title}
            </Typography>
            <Typography variant="body3" color="text.secondary">
              {desc}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
};

export default ProjectCard;
