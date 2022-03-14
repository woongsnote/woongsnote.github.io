module.exports = {
  title: `woongnoste`,
  description: `개발자 웅이의 개발일기`,
  language: `ko`, // `ko`, `en` => currently support versions for Korean and English
  siteUrl: `https://woongsnote.github.io`,
  ogImage: `/og-image.png`, // Path to your in the 'static' folder
  comments: {
    utterances: {
      repo: ``, // `zoomkoding/zoomkoding-gatsby-blog`,
    },
  },
  ga: '0', // Google Analytics Tracking ID
  author: {
    name: `문지웅`,
    bio: {
      role: `개발자`,
      description: ['능동적으로 일하는', '이로운 것을 만드는', '매일 노력하는'],
      thumbnail: 'profile.jpg', // Path to the image in the 'asset' folder
    },
    social: {
      github: `https://github.com/woongsnote`,
      linkedIn: ``, // `https://www.linkedin.com/in/jinhyeok-jeong-800871192`,
      email: `woongsnote@gmail.com`,
    },
  },

  // metadata for About Page
  about: {
    timestamps: [
      // =====       [Timestamp Sample and Structure]      =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!) =====
      {
        date: '',
        activity: '',
        links: {
          github: '',
          post: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
      {
        date: '2022.03 ~',
        activity: '스파르타 코딩 클럽 미니 튜터 3기 (앱 개발)',
        links: {
          post: '',
          // github: 'https://github.com/zoomkoding/zoomkoding-gatsby-blog',
          // demo: 'https://www.zoomkoding.com',
        },
      },
      {
        date: '2022.01 ~',
        activity: '개발 블로그 개발 및 운영',
        links: {
          post: '/project/gatsby-blog',
          // github: 'https://github.com/zoomkoding/zoomkoding-gatsby-blog',
          // demo: 'https://www.zoomkoding.com',
        },
      },
      {
        date: '2021.12 ~',
        activity: '영화 리뷰 APP 개발 및 운영',
        links: {
          post: '/project-tmcb',
          github: 'https://github.com/woongsnote/tmcb',
          googlePlay: 'https://play.google.com/store/apps/details?id=com.woongsnote.mcb',
        },
      },
      {
        date: '2021.12 ~ 2021.12 ',
        activity: '스파르타코딩클럽 메이킹 챌린지 7기',
        links: {
          post: '/review/making-challenge-07',
          demo: 'http://woongflix.shop',
        },
      },
    ],

    projects: [
      // =====        [Project Sample and Structure]        =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!)  =====
      {
        title: '',
        description: '',
        techStack: ['', ''],
        thumbnailUrl: '',
        links: {
          post: '',
          github: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
      {
        title: '개발 블로그 운영',
        description:
          '기존에 티스토리로 개발 블로그를 만들었으나, React를 공부하면서 좀 더 다양하게 Customizing 하고자 Gatsby 기반 개발 블로그로 변경했습니다.',
        techStack: ['gatsby', 'react'],
        thumbnailUrl: '',
        links: {
          post: '/project/gatsby-blog',
          github: 'https://github.com/woongsnote/woongsnote.github.io',
          demo: 'https://woongsnote.github.io',
        },
      },
      {
        title: '영화 리뷰 Android Application개발',
        description:
          '평소 영화 보는 것을 좋아해서, 직접 만든 리뷰 앱에서 리뷰를 관리하기 위해, 영화 리뷰용 안드로이드 애플리케이션을 직접 개발했습니다.',
        techStack: ['android', 'kotlin'],
        thumbnailUrl: 'tmcb.png',
        links: {
          post: '/project-tmcb',
          github: 'https://github.com/woongsnote/tmcb',
          googlePlay: 'https://play.google.com/store/apps/details?id=com.woongsnote.mcb',
        },
      },
    ],
  },
};
