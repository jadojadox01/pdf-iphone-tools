import { Icon } from "../Icons";

export default function GuideToolbar({ title, url, readMinutes }) {
  const shareUrl = encodeURIComponent(url);
  const shareText = encodeURIComponent(title);

  return (
    <>
      <div className="guide-share" aria-label="Share this guide">
        <a
          className="guide-share-btn is-facebook"
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
        >
          <Icon name="facebook" size={16} />
        </a>
        <a
          className="guide-share-btn is-linkedin"
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
        >
          <Icon name="linkedin" size={16} />
        </a>
        <a
          className="guide-share-btn is-x"
          href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
        >
          <Icon name="x" size={16} />
        </a>
      </div>
      <p className="guide-byline">
        <span>
          <Icon name="clock" size={16} />
          {readMinutes} min read
        </span>
      </p>
    </>
  );
}
