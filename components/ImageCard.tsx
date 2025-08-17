import DownloadIcon from "./icons/DownloadIcon.tsx";

interface ImageCardProps {
  hasImage: boolean;
  isLoading: boolean;
  collage?: string;
  onDownload: () => void;
}

export default function ImageCard({
  hasImage,
  isLoading,
  collage,
  onDownload,
}: ImageCardProps) {
  return (
    <div className="md:flex w-full max-w-lg">
      <div className="card w-full bg-base-300 shadow-sm">
        <div className="card-body items-center justify-center text-center overflow-hidden">
          {!hasImage && !isLoading && (
            <figure className="w-full">
              <img
                src="/home-grid.webp"
                alt="Letterboxd collage"
                className="rounded-md w-auto h-auto max-h-[65vh] object-contain"
              />
            </figure>
          )}

          {isLoading && (
            <div className="skeleton w-full h-[65vh] rounded-md bg-base-200" />
          )}

          {hasImage && !isLoading && collage && (
            <>
              <figure className="w-full">
                <img
                  src={collage}
                  alt="Letterboxd collage"
                  className="rounded-md w-auto h-auto max-h-[65vh] object-contain"
                />
              </figure>

              <div className="card-actions">
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={onDownload}
                  data-umami-event="Download button"
                >
                  <DownloadIcon className="fill-current w-3 h-3" />
                  Download
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
