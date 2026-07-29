(function () {
  var QUIZ_URL = 'https://your-project.vercel.app/quiz.html';
  var CONTAINER_ID = 'smile-quiz-embed';
  // ============================================================

  function init() {
    var container = document.getElementById(CONTAINER_ID);
    if (!container) {
      console.warn('[smile-quiz] No element with id="' + CONTAINER_ID + '" found on this page.');
      return;
    }

    // Build the iframe src, forwarding any UTM params from the current page
    var frameUrl = new URL(QUIZ_URL, window.location.href);
    var parentParams = new URLSearchParams(window.location.search);
    var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    utmKeys.forEach(function (k) {
      var v = parentParams.get(k);
      if (v) frameUrl.searchParams.set(k, v);
    });

    // Build the iframe
    var frame = document.createElement('iframe');
    frame.id = 'smileQuizFrame';
    frame.src = frameUrl.toString();
    frame.title = 'Smile Fit Quiz';
    frame.setAttribute('scrolling', 'no');
    frame.style.width = '100%';
    frame.style.maxWidth = '480px';
    frame.style.border = 'none';
    frame.style.display = 'block';
    frame.style.overflow = 'hidden';
    frame.style.minHeight = '420px';
    frame.style.margin = '0 auto';

    container.appendChild(frame);

    // Listen for messages from the quiz iframe
    window.addEventListener('message', function (e) {
      var data = e.data || {};

      if (data.type === 'quizResize' && typeof data.height === 'number') {
        frame.style.height = data.height + 'px';
      }

      if (data.type === 'quizComplete') {
        if (window.dataLayer) {
          window.dataLayer.push({ event: 'quiz_complete', quiz_answers: data.payload });
        }
        // Optional: react on the parent page, e.g.
        // window.location.href = '/thank-you';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();