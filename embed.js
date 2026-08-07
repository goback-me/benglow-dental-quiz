(function () {
  // ============================================================
  // CONFIG — one entry per quiz embedded on this page
  // ============================================================
  var QUIZZES = [
    { quizUrl: 'https://benglow-dental-quiz.vercel.app/', containerId: 'smile-quiz-embed' },
    { quizUrl: 'https://benglow-dental-quiz.vercel.app/invisalign.html', containerId: 'invisalign-quiz-embed' }
  ];
  // ============================================================

  function initOne(config) {
    var container = document.getElementById(config.containerId);
    if (!container) {
      // Most pages only have one of the containers — that's expected, not an error.
      return;
    }

    container.style.width = '100%';
    container.style.lineHeight = '0';
    container.style.fontSize = '0';

    var frameUrl = new URL(config.quizUrl, window.location.href);
    var parentParams = new URLSearchParams(window.location.search);
    var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    utmKeys.forEach(function (k) {
      var v = parentParams.get(k);
      if (v) frameUrl.searchParams.set(k, v);
    });

    var frame = document.createElement('iframe');
    frame.id = config.containerId + '-frame';
    frame.src = frameUrl.toString();
    frame.title = 'Smile Fit Quiz';
    frame.setAttribute('scrolling', 'no');
    frame.style.width = '100%';
    frame.style.border = 'none';
    frame.style.display = 'block';
    frame.style.margin = '0';
    frame.style.padding = '0';
    frame.style.height = '420px';

    container.appendChild(frame);

    window.addEventListener('message', function (e) {
      if (e.source !== frame.contentWindow) return; // not this quiz's iframe
      var data = e.data || {};

      if (data.type === 'quizResize' && typeof data.height === 'number') {
        frame.style.height = data.height + 'px';
        container.style.height = data.height + 'px';
      }

      if (data.type === 'quizComplete') {
        if (window.dataLayer) {
          window.dataLayer.push({ event: 'quiz_complete', quiz_answers: data.payload });
        }
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        }
      }
    });
  }

  function init() {
    QUIZZES.forEach(initOne);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
