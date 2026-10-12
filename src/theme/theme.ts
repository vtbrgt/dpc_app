import type { ThemeConfig } from 'antd';

export const tema: ThemeConfig = {
  token: {
    colorPrimary: '#1f3a5f',
    colorBgLayout: '#f2f4f7',
    colorText: '#1e2a38',
    borderRadius: 4,
    fontFamily:
      "'Segoe UI', system-ui, -apple-system, Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    Layout: {
      headerBg: '#1f3a5f',
      headerColor: '#ffffff',
    },
    Table: {
      headerBg: '#f7f9fc',
      headerColor: '#5b6878',
    },
  },
};
