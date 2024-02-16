# **Educación adaptativa**
<p>
  El siguiente proyecto es una aplicación para la educación adaptativa, a grandes rasgos cuenta con dos módulos, 
  uno para la administración del examen y otro para realizar el examen, utiliza (Lazy Loading) para cargar solo el 
  módulo de administración solo en caso de ser necesario.

  Se utiliza la base de datos Firestore de Firebase, Tailwind, CDK de Angular, RXJS, SASS, Routing, Formularios reactivos y guardianes para protección de usuarios no logeados (utiliza el sistema de inicio de sesión de email y contraseña de Firebase).
</p>

## **A continuación se muestran algunas capturas de la aplicación en funcionamiento.**

### Página de inicio del sitio:

![Imagen de inicio](https://github.com/JorgeGerardo/AdaptativeEducation/blob/master/imagenes/homePage.png)


### **Tabla de administración de las asignaturas del examen**

![](https://github.com/JorgeGerardo/AdaptativeEducation/blob/master/imagenes/subjectTable.png)

<p>
  Esta tabla creada con el CDK permite visualizar las asignaturas existentes en la base de datos (Firestore) y eliminarlas si es necesario.
</p>

### **Tabla de preguntas existentes en el examen**
<p>
  Esta tabla permite editar, eliminar y ver las preguntas correspondientes, además que cuenta con un buscador reactivo el cuál genera una búsqueda cada 300ms después de dejar de escribir en él mediante RXJS.
</p>

![](https://github.com/JorgeGerardo/AdaptativeEducation/blob/master/imagenes/questionTable.png)

### Formulario para agregar una pregunta al examen

<p>
  Es un formulario reactivo el cuál cambia sus estilos a mediada se va llenando el formulario, en caso de que este incorrecto algo, se colorean de rojo los bordes y verifica que las direcciones URL de las imagenes sean validas al mismo tiempo que verifica
  que no haya URLs repetidas.
</p>

![](https://github.com/JorgeGerardo/AdaptativeEducation/blob/master/imagenes/newQuestionForm.png)



### Examen en una pregunta múltiple
<p>
  Examen en una pregunta, se debe seleccionar una opción para que se active el botón de «Siguiente».
</p>

![](https://github.com/JorgeGerardo/AdaptativeEducation/blob/master/imagenes/multipleQuestion.png)



### Examen en una pregunta de tipo imagen

<p>
  Se debe seleccionar la imagen correcta presionando en ella y esta misma cambiará el color de su borde a verde.
</p>

![](https://github.com/JorgeGerardo/AdaptativeEducation/blob/master/imagenes/image%20question.png)

