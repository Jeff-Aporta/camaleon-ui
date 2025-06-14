import React from "react";
import { Box } from "@mui/material";
import { DialogSimple } from "./dialog";
import { Typography } from "@mui/material";
import { Tooltip, Chip } from "@mui/material";

export function ImageLocal(props) {
 const { src, ...rest } = props;
 const base = process.env.PUBLIC_URL || '';
 const path = src.startsWith('/') ? src : `/${src}`;
 return (
   <Box
     component="img"
     {...rest}
     alt=""
     src={`${base}${path}`}  
   />
 );
}

export function Info({ title, title_text, ...rest_props }) {
 return (
   <DialogSimple
     {...rest_props}
     text={title}
     title_text={global.nullish(title_text, "Información")}
   >
     <TooltipGhost {...rest_props} title={title}>
       <Typography color="secondary" className="d-inline-block c-pointer">
         <i className="fa-solid fa-info-circle" />
       </Typography>
     </TooltipGhost>
   </DialogSimple>
 );
}

export function TooltipGhost(props) {
 return <Tooltip {...props} PopperProps={{ sx: { pointerEvents: "none" } }} />;
}

export function TitleInfo({ title, information, ...rest }) {
 return (
   <Typography variant="h6" {...rest}>
     {title}
     <Info
       placement="right"
       className="ml-20px"
       title_text={
         <React.Fragment>
           <div style={{ opacity: 0.8, fontSize: "10px" }} className="mb-20px">
             <Chip label="Información" variant="outlined" />
           </div>
           {title}
         </React.Fragment>
       }
       title={information}
     />
   </Typography>
 );
}