import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

import { PaperP } from "@framework";
import SchoolIcon from '@mui/icons-material/School';
import { href as hrefCamaleon } from "@framework";

export function BuildSectionDoc({ namekey="", title, description, cards, href }) {
  return (
    <PaperP>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" paragraph>
        {description}
      </Typography>
      <BuildDocCards cards={cards} namekey={namekey} />
      <br />
      <p>
        <Button
          variant="contained"
          size="large"
          href={hrefCamaleon(href)}
          startIcon={<SchoolIcon />}
        >
          Aprender más
        </Button>
      </p>
    </PaperP>
  );
}

export function DocCard({ title, description, href }) {
  return (
    <Card elevation={3} sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2">{description}</Typography>
      </CardContent>
    </Card>
  );
}

export function BuildDocCards({ cards = [], namekey="" }) {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="space-evenly" gap={2}>
      {cards.map(({ title, description, href }) => (
        <Box key={namekey+title}>
          <DocCard title={title} description={description} href={hrefCamaleon(href)} />
        </Box>
      ))}
    </Box>
  );
}
