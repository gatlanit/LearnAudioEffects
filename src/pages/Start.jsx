import ChapterNav from '../components/ChapterNav';
import Template from '../components/scenes/Template';

export default function Start() {
  document.title = "Get started | Learn Audio Effects";

  return (
    <main className="main_content">
      <h1>Get started</h1>
      <p>Welcome to Learn Audio Effects. As you go thorugh this website, you'll learn about some of the most common audio effects used in music production (though it's not thier only application).</p>
      <p>You'll be interacting with simplified controls rather than traditional dials and faders (sliders) for each audio effect accompanied with visualizations to better understand what each paramater does and how it affects the sound</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt nobis ab esse nisi? Eius enim officia at reprehenderit, voluptas illo quidem nemo ad laborum, iusto dolor labore temporibus dolores iure!</p>

      <Template />

      <ChapterNav />
    </main>
  );
}
