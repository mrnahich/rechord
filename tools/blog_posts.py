# Blog source. Each post is plain HTML body text; build_blog.py turns this into blog.html and blog/<slug>.html.
# Only describe what the iPhone app does today (no Next or Android features).

POSTS = [
  {
    "slug": "why-we-built-rechord",
    "title": "Why we built ReChord",
    "kicker": "Our story",
    "date": "2026-11-28",
    "cover": "why-we-built-rechord.jpg",
    "cover_alt": "A quiet street at dusk with warm light in the windows",
    "excerpt": "Everything we post slides down a timeline and disappears. But the moments that matter happened somewhere. We wanted to give them their address back.",
    "body": """
<p class="lede">Think of a place that still means something to you. A bench where you used to sit after school. The corner where you heard the news. The platform where you said goodbye. You can probably picture it right now. What you can't do is go back and hear it.</p>

<p>That small, stubborn gap is where ReChord started.</p>

<h2>Feeds forget</h2>
<p>We share more than any generation before us. Photos, stories, captions, threads. And almost all of it has the same fate: it lands at the top of a timeline, gets a few seconds of attention, and slides down until nobody sees it again. A feed is built to move. That's what makes it good for news and bad for memory.</p>
<p>The other thing a feed does is cut a moment off from where it happened. A photo of a sunset might carry a location tag, but you will never come across it by standing in that spot. The physical world, where life actually happens, carries almost none of what we say about it.</p>

<h2>Places don't</h2>
<p>Places are the opposite of feeds. They stay. The bench is still there. The café still opens at eight. The platform still hums when the train comes in. Places are where our memories are anchored, even when nothing we've shared is anchored to them.</p>
<p>So we asked a simple question: what if a moment could stay exactly where it happened, and anyone who walked by later could hear it?</p>

<h2>Why voice</h2>
<p>We tried to picture the most honest way to leave something behind, and kept coming back to the human voice. A voice carries things text flattens: a laugh in the middle of a sentence, a pause before the hard part, the wind, the traffic, the music from a window upstairs. It's quick to make, there's nothing to edit, and it's hard to fake. Hearing a stranger's voice in the place they stood feels less like reading a post and more like meeting someone.</p>
<p>That's why ReChord is voice-first. No text posts, no filters. Just up to a minute of you, in your own voice.</p>

<h2>What ReChord is</h2>
<p>ReChord is a map of voices. You record a moment, and it's pinned to the spot where you're standing. You choose whether it shows at the exact spot or just nearby, and whether it's public or only for you. Then you, and anyone exploring the map, can find it, listen, and feel a little of what you felt there.</p>
<p>There's no timeline for a voice to sink in. It doesn't expire. A voice left today on a corner in Tehran, a beach in Brighton or a station in Zürich can be heard there next week, next year, or whenever someone wanders by.</p>

<h2>The people behind it</h2>
<p>ReChord started unexpectedly, as many meaningful things do: five people and one idea that wouldn't leave us alone. We come from engineering, business, marketing and product, and we've all had that moment of standing somewhere and wishing it could talk back. You can <a href="about.html">meet us on the Team page</a>, where, fittingly, each of us left a voice on a little map.</p>

<h2>Where we're going</h2>
<p>ReChord is live on iPhone today and free on the App Store. We announce new things only when you can actually use them, and you can follow each release on our <a href="updates.html">Updates</a> page.</p>
<p>For now, our ask is small. Next time you're somewhere that matters, say something. Leave it there. Someone will find it.</p>
""",
  },
  {
    "slug": "how-rechord-works",
    "title": "How ReChord works: a complete guide",
    "kicker": "Guide",
    "date": "2026-11-28",
    "cover": "how-rechord-works.jpg",
    "cover_alt": "A phone showing a dark map with glowing voice pins",
    "excerpt": "Recording, pinning, privacy, covers, exploring the map, sharing and likes: everything you can do in ReChord today, step by step.",
    "body": """
<p class="lede">ReChord does one thing: it lets you leave your voice in a place. This guide walks through everything the iPhone app does today, from your first recording to finding voices on the other side of the world.</p>

<h2>1. Getting started</h2>
<p>Download ReChord free from the <a data-store target="_blank" rel="noopener">App Store</a> and create an account with your email, or sign in with Apple or Google. Pick a username and a display name, and add a profile photo if you like. That's all you need to start.</p>
<p>ReChord asks for two permissions, and it helps to know why:</p>
<ul>
  <li><strong>Microphone</strong>, so you can record.</li>
  <li><strong>Location while you use the app</strong>, so a voice can be pinned where you are and the map can open around you. ReChord does not track your location in the background.</li>
</ul>

<h2>2. Recording a voice</h2>
<p>Tap the microphone in the middle of the tab bar and start talking. A voice can be <strong>up to 60 seconds</strong> long. That's enough for a moment, a thought, a story, or a small "I was here." It's deliberately not enough to perform.</p>
<p>There are no filters and no editing. Background sound is part of it: the rain, the café, the waves, the band down the street. That's often what makes a voice worth hearing later.</p>

<h2>3. Pinning it to a place</h2>
<p>When you finish, your voice is pinned to the spot where you're standing. You choose how precise that is:</p>
<ul>
  <li><strong>Precise</strong> pins the very bench, doorway or table.</li>
  <li><strong>Nearby</strong> shows it in the right neighbourhood, without the exact spot.</li>
</ul>
<p>A good rule: use precise for public places, and nearby for anything close to your home, work or daily routine.</p>

<h2>4. Public or private</h2>
<p>Every voice is either <strong>public</strong> or <strong>private</strong>, and you decide with one switch before you send it.</p>
<ul>
  <li>A <strong>public</strong> voice appears on the map for everyone, along with your name, photo and the title you gave it.</li>
  <li>A <strong>private</strong> voice is visible only to you. It's a way to keep a voice diary that lives on a map: where you were when you got the job, the street you walked on your last night in a city.</li>
</ul>

<h2>5. A title and a cover</h2>
<p>Give your voice a short title and, if you like, a cover photo, so the place has a face. Name the place too, so listeners know where they are. A title like "Rain, and a piano upstairs" tells someone what they're about to hear before they press play.</p>

<h2>6. Exploring the map</h2>
<p>The map is the feed. Open it and you'll see voices around you as pins. Zoom into a street and listen to what happened there, or travel anywhere on Earth and explore a city you miss or have never seen. Tap a pin to play it. There's no algorithm deciding what's at the top: voices live where they were left.</p>

<h2>7. Sharing a voice</h2>
<p>Every public voice can be shared with <strong>one link</strong>. Send it in any chat, and it opens the voice right where it lives on the map, so there are no screenshots and no explaining where it was. People you send it to may be able to listen even before they install ReChord.</p>

<h2>8. Likes, listens and activity</h2>
<p>When someone listens to or likes your voice, it comes back to you. Your activity tab shows who loved what you left behind and where, and with notifications on, you'll know when it happens.</p>

<h2>9. Staying safe</h2>
<ul>
  <li>Think before you publish a precise location that reveals where you live, work or study.</li>
  <li>Only record other people when they're happy to be recorded.</li>
  <li>If you hear something that shouldn't be there, report it from the app. You can also block any user. They won't be told.</li>
  <li>You can delete a voice, or your whole account, at any time from the app.</li>
</ul>

<h2>Your first voice</h2>
<p>The best way to understand ReChord is to leave one voice. It doesn't need to be profound. Stand somewhere you like, press the button, and say why. Then go back next month and listen.</p>
""",
  },
  {
    "slug": "why-voice",
    "title": "Why voice? What a few seconds of sound remembers",
    "kicker": "Ideas",
    "date": "2026-11-28",
    "cover": "why-voice.jpg",
    "cover_alt": "A lit window above a rainy street at night",
    "excerpt": "Photos show what a place looked like. A voice tells you what it felt like to be there. Why we built ReChord around sound.",
    "body": """
<p class="lede">Photos show what a place looked like. A voice tells you what it felt like to be there. That difference is the whole reason ReChord is built around sound.</p>

<h2>The things a photo can't hold</h2>
<p>Look at an old holiday photo and you'll see the place clearly. Now imagine you could hear ten seconds from that same afternoon: your friend's laugh, the waves, a street seller calling out, the exact way you said "we should come back here." The photo tells you where you were. The sound puts you back there.</p>
<p>Voice carries a whole layer of meaning that pictures and text leave out: tone, hesitation, excitement, tiredness, the little breath before something important. Two people can type the same sentence; they will never say it the same way.</p>

<h2>Low effort, high emotion</h2>
<p>Recording a voice is one of the least demanding ways to create something. There's no camera to point, nothing to frame, no caption to polish. You press a button and talk. That makes it honest, because there's very little room to perform, and it makes it fast enough to do in the moment, when the feeling is still there.</p>
<p>For the listener, it works the other way around. A few seconds of a real person's voice is one of the most personal things you can receive. It's why people keep old voicemails for years.</p>

<h2>Sound belongs to a place</h2>
<p>A voice recorded somewhere is never just a voice. It's the room, the street and the weather around it. A note left on a beach has the sea in it. A story told at a train station has announcements and footsteps underneath. When you listen to that voice in the same spot, the place and the recording overlap, and a quiet corner suddenly has something to say.</p>
<p>That's why every voice in ReChord is pinned to where it was spoken. The place gives the voice context, and the voice gives the place a memory.</p>

<h2>Why not text?</h2>
<p>Text is wonderful for information and terrible at presence. Most location-based notes are reviews: four stars, good coffee, slow service. Useful, but nobody stands on a corner and feels something because of a review. We didn't want ReChord to become another layer of ratings on top of the map. We wanted it to feel like people.</p>
<p>Keeping ReChord voice-only also keeps it calm. There's no endless scroll of text to skim and nothing racing for your attention. You find a voice, you listen for a minute, and you move on with a little more of that place in your head.</p>

<h2>What people leave</h2>
<p>The voices people leave tend to fall into a few kinds:</p>
<ul>
  <li><strong>Memories</strong>: "Three years ago, right here, I spilled water all over him on our first date."</li>
  <li><strong>Tips</strong>: the dish to order, the view to look up for, the bench that gets the morning sun.</li>
  <li><strong>Notes to self</strong>: a message for whoever you'll be next time you stand here.</li>
  <li><strong>Moments</strong>: rain on a window, a street musician, a city waking up.</li>
</ul>

<h2>Try it once</h2>
<p>The next time a place makes you feel something, don't take a photo first. Open ReChord and say why. Sixty seconds is plenty. You may be surprised how much a few seconds of your own voice remembers.</p>
""",
  },
]
