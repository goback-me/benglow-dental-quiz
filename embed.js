(function () {
  // ============================================================
  // CONFIG — only thing you need to change
  // ============================================================
  var QUIZ_URL = 'https://benglow-dental-quiz.vercel.app/';
  var CONTAINER_ID = 'smile-quiz-embed';
  // ============================================================

function init() {
    var container = document.getElementById(CONTAINER_ID);
    if (!container) {
      console.warn('[smile-quiz] No element with id="' + CONTAINER_ID + '" found on this page.');
      return;
    }

    container.style.width = '100%';
    container.style.lineHeight = '0';
    container.style.fontSize = '0';

    var frameUrl = new URL(QUIZ_URL, window.location.href);
    var parentParams = new URLSearchParams(window.location.search);
    var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    utmKeys.forEach(function (k) {
      var v = parentParams.get(k);
      if (v) frameUrl.searchParams.set(k, v);
    });

    var frame = document.createElement('iframe');
    frame.id = 'smileQuizFrame';
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
      var data = e.data || {};

      if (data.type === 'quizResize' && typeof data.height === 'number') {
        frame.style.height = data.height + 'px';
        container.style.height = data.height + 'px';
      }

      if (data.type === 'quizComplete') {
        if (window.dataLayer) {
          window.dataLayer.push({ event: 'quiz_complete', quiz_answers: data.payload });
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();