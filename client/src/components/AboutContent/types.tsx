export type IconName =
  | 'FaCode'
  | 'FaBrain'
  | 'FaAtom'
  | 'FaUtensils'
  | 'FaDumbbell'
  | 'FaBook'
  | 'FaGithub'
  | 'FaLinkedin'
  | 'FaGraduationCap'
  | 'FaChessKing';

export type ColorName = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow';

export interface InterestItem {
  text: string;
  icon: IconName;
  color: ColorName;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: IconName;
  iconColor: string;
}
