export const gestureChips = [
 {
   title: "onZoom()",
   title_text: "onZoom",
   text: (
     <>
       Escucha gestos de zoom (pellizco) con dos dedos. Ejecuta la función
       callback con el evento y el estado, donde la separación entre dedos es
       la distancia y el tipo de gesto indica acercamiento o alejamiento.
     </>
   ),
   button_text: "Cerrar",
   variant: "body1",
 },
 {
   title: "onZoomIn()",
   title_text: "onZoomIn",
   text: (
     <>
       Alias de <code>onZoom</code> para detectar solo zoom-in (agrandar).
       Llama a la función callback con el evento cuando el gesto es de tipo
       acercamiento.
     </>
   ),
   button_text: "Cerrar",
   variant: "body1",
 },
 {
   title: "onZoomOut()",
   title_text: "onZoomOut",
   text: (
     <>
       Alias de <code>onZoom</code> para detectar solo zoom-out (reducir).
       Llama a la función callback con el evento cuando el gesto es de tipo
       alejamiento.
     </>
   ),
   button_text: "Cerrar",
   variant: "body1",
 },
 {
   title: "onRotate()",
   title_text: "onRotate",
   text: (
     <>
       Escucha gestos de rotación con dos dedos. Ejecuta la función callback
       con el evento y el estado, donde el ángulo es la orientación entre los
       dedos, la variación indica el cambio desde el movimiento previo y el
       sentido señala horario o antihorario.
     </>
   ),
   button_text: "Cerrar",
   variant: "body1",
 },
 {
   title: "onRotateLeft()",
   title_text: "onRotateLeft",
   text: (
     <>
       Alias de <code>onRotate</code> para detectar solo rotaciones en sentido
       horario.
     </>
   ),
   button_text: "Cerrar",
   variant: "body1",
 },
 {
   title: "onRotateRight()",
   title_text: "onRotateRight",
   text: (
     <>
       Alias de <code>onRotate</code> para detectar solo rotaciones en sentido
       antihorario.
     </>
   ),
   button_text: "Cerrar",
   variant: "body1",
 },
 {
   title: "onSwipe()",
   title_text: "onSwipe",
   text: (
     <>
       Escucha gestos de deslizamiento con un dedo. Ejecuta la función callback
       con el evento y el estado al superar la distancia mínima, donde el
       inicio marca el comienzo del gesto y la dirección indica hacia dónde se
       desliza.
     </>
   ),
   button_text: "Cerrar",
   variant: "body1",
 },
];