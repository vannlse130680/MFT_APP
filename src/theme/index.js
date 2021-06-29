import { createMuiTheme } from '@material-ui/core';
import { viVN } from '@material-ui/core/locale';
import palette from './palette';
import typography from './typography';
import overrides from './overrides';

const theme = createMuiTheme({
  palette,
  typography,
  overrides
}, viVN);

export default theme;
