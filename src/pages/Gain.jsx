import ChapterNav from '../components/ChapterNav';
import GainScene from '../components/scenes/GainScene';

export default function Gain() {
  document.title = "Gain | Learn Audio Effects"
  return (
    <main className="main_content">
      <h1>What Is Gain?</h1>
      <p>
        Gain is basically how much you boost or reduce the strength (volume) of a sound. 
        Think of it like a volume knob that controls how loud something gets before it moves through the rest of your audio chain.</p>
      <p>
        There are different types of gain controls. 
        One of the most common is called <u>Channel Gain</u>. 
        This is used to adjust the volume of an individual track (like a guitar or vocal) so it fits better in the mix. 
        For example, you might turn up the gain on a quiet vocal to make it stand out more in a song.
      </p>
      <GainScene />
      <p>
        Other types of gain, like <b>Makeup Gain</b> or <b>Preamp Gain</b>, work in similar ways but have extra "quirks". 
        Some can add color or warmth to the sound, while others just make it louder or quieter without impacting the tone. 
        Channel and Master Gain usually give you a clean volume adjustment with no added effects.
      </p>
      <ChapterNav />
    </main>
  );
}
