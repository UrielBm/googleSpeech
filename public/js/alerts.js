const handleInfoAlert = (recordFuction) => {
  Swal.fire({
    title: "Del Monte",
    text: "La dinámica consiste en poder decir la frase lo más perfecta posible, para esto necesitamos permiso de acceder a tu microfono ¿serás capaz de hacerlo a la perfeccipon?",
    icon: "info",
    showCancelButton: false,
    confirmButtonColor: "#3085d6",
    confirmButtonText: "¡Vamos a probar!",
  }).then((result) => {
    if (result.isConfirmed) {
      recordFuction();
    }
  });
};

const handleTraductionSpeechAlert = () => {
  Swal.fire({
    title: "Del Monte",
    text: "Gracias por la espera, se ha validado tu audio y hemos asignado un puntaje. Muy buen trabajo.",
    icon: "success",
    showCancelButton: false,
    showConfirmButton: false,
    timer: 2000,
  });
};
