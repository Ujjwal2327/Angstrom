import { Download, ImageIcon, Link as LinkIcon, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toBlob, toPng, toSvg } from "html-to-image";
import { toast } from "sonner";
import useStore from "../store";
import { useHotkeys } from "react-hotkeys-hook";

export default function ExportOptions({ targetRef }) {
  const title = useStore((state) => state.title);
  const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

  const copyImage = async (e) => {
    e.preventDefault();
    const loading = toast.loading("Copying...");

    try {
      const imgBlob = await toBlob(targetRef.current, {
        pixelRatio: 2,
      });
      const img = new ClipboardItem({ "image/png": imgBlob });
      navigator.clipboard?.write([img]);
      toast.success("Image copied to clipboard!");
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      toast.dismiss(loading);
    }
  };

  const copyLink = (e) => {
    e.preventDefault();

    try {
      const state = useStore.getState();
      const queryParams = new URLSearchParams({
        ...state,
        code: btoa(state.code),
      }).toString();
      navigator.clipboard?.writeText(`${baseurl}/code-snapshot?${queryParams}`);

      toast.success("Link copied to clipboard!");
    } catch (error) {
      if (error.code === 5) toast.error("Emojis are not allowed!");
      else toast.error(error.message || "Something went wrong!");
    }
  };

  const saveImage = async (e, name, format) => {
    e.preventDefault();
    const loading = toast.loading(`Exporting ${format} image...`);

    try {
      let imgUrl, filename;
      switch (format) {
        case "PNG":
          imgUrl = await toPng(targetRef.current, { pixelRatio: 2 });
          filename = `${name}.png`;
          break;
        case "SVG":
          imgUrl = await toSvg(targetRef.current, { pixelRatio: 2 });
          filename = `${name}.svg`;
          break;

        default:
          return;
      }

      const a = document.createElement("a");
      a.href = imgUrl;
      a.download = filename;
      a.click();

      setTimeout(() => {
        toast.dismiss(loading);
      }, 2000);

      toast.success("Exported successfully!");
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      toast.dismiss(loading);
    }
  };

  useHotkeys("ctrl+c", copyImage);
  useHotkeys("ctrl+shift+c", copyLink);
  useHotkeys("ctrl+s", (e) => saveImage(e, title, "PNG"));
  useHotkeys("ctrl+shift+s", (e) => saveImage(e, title, "SVG"));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Share className="mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="gap-2" onClick={copyImage}>
          <ImageIcon size={20} />
          Copy Image
          <DropdownMenuShortcut>⌘ C</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2" onClick={copyLink}>
          <LinkIcon size={20} />
          Copy Link
          <DropdownMenuShortcut>⌘ ⇧ C</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2"
          onClick={(e) => saveImage(e, title, "PNG")}
        >
          <Download size={20} />
          Save as PNG
          <DropdownMenuShortcut>⌘ S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2"
          onClick={(e) => saveImage(e, title, "SVG")}
        >
          <Download size={20} />
          Save as SVG
          <DropdownMenuShortcut>⌘ ⇧ S</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
