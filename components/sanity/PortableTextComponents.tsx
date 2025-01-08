import { AdvancedCodeBlock } from './AdvancedCodeBlock';
import SanityImage from './SanityImage';
import VideoEmbed from './VideoEmbed';
import Blockquote from './Blockquote';
import CallToAction from './CallToAction';
import CodeSandboxEmbed from './CodeSandboxEmbed';
import Divider from './Divider';
import Timeline from './Timeline';

const PortableTextComponents = {
  types: {
    image: SanityImage,
    codeInput: AdvancedCodeBlock,
    videoEmbed: VideoEmbed,
    blockquote: Blockquote,
    // // table: Table,
    callToAction: CallToAction,
    // codeSandbox: CodeSandboxEmbed,
    divider: Divider,
    timeline: Timeline,
  },

  
  
};

export default PortableTextComponents;
