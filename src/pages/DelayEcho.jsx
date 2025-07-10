import ChapterNav from '../components/ChapterNav';
import EchoScene from '../components/scenes/EchoScene';
import ParametersRow from '../components/ParamatersRow';
import { useState } from 'react';

export default function DelayEcho() {
  document.title = "Delay | Learn Audio Effects"

  const [params, setParams] = useState({
    mix: 0,
    feedback: 0,
    delayTime: 0,
  });

  return (
    <main className="main_content">
      <h1>Delay/Echo</h1>
      <p>A delay, or echo, is exactly as the name implies. It's an effect that records a short interval of the sound and then plays it at a constant rate, creating repetitions or <b>echos</b> of the captured sound.</p>

      {/* EchoScene now receives values */}
      <EchoScene mix={params.mix} feedback={params.feedback} delayTime={params.delayTime} />

      <ParametersRow
        gap="1.6rem"
        onChange={setParams}
        config={[
          { id: 'feedback', type: 'knob', label: 'Feedback', max: 1, color: '#a442f5' },
          { id: 'delayTime', type: 'knob', label: 'Delay Time', max: 1, color: '#a442f5' },
          { id: 'mix', type: 'knob', label: 'Dry/Wet', max: 1, color: '#a442f5' },
        ]}
      />

      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro illo enim iusto obcaecati, aspernatur consequatur sint. Rerum nisi suscipit, tenetur cupiditate iste non vel fugit, reprehenderit, quam iure expedita porro?</p>
      <ChapterNav />
    </main>
  );
}
