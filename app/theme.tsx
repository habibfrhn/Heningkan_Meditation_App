import { StyleSheet } from 'react-native';

// Define reusable colors
export const COLORS = {
  background: '#f1f2f4',
  white: '#FFFFFF',
  black: '#000000',
  primary: '#F4CE14',
};

// Define reusable fonts
export const FONTS = {
  regular: 'Gilroy-Regular',
};

// Define reusable text styles
export const TEXT_STYLES = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  body: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
});

// Define reusable layout styles
export const LAYOUT = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    padding: 10,
  },
  largeSection: {
    width: '100%',
    height: 150,
  },
  smallSection: {
    width: '48%',
    height: 150,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
});

export default { COLORS, FONTS, TEXT_STYLES, LAYOUT };
