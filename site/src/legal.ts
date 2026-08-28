import '@fontsource/atkinson-hyperlegible/400.css';
import '@fontsource/atkinson-hyperlegible/700.css';
import './style.css';
import './legal.css';

const heading = document.querySelector<HTMLElement>('h1');
const announcement = document.querySelector<HTMLElement>('#route-announcement');
if (heading && !window.location.hash) {
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  if (announcement) announcement.textContent = `${heading.textContent?.trim() ?? 'Page'} loaded`;
}
