const formatTimeAgo = (date) => {
  let formatter = new Intl.RelativeTimeFormat(undefined, {
    numeric: "auto",
  });
  const DIVISION = [
    { amount: 60, name: "seconds" },
    { amount: 60, name: "minutes" },
    { amount: 24, name: "hours" },
    { amount: 7, name: "days" },
    { amount: 4.34524, name: "weeks" },
    { amount: 12, name: "months" },
    { amount: Number.POSITIVE_INFINITY, name: "years" },
  ];
  let duration = (date.valueOf() - new Date().valueOf()) / 1000;
  for (let i = 0; i < DIVISION.length; i++) {
    const division = DIVISION[i];
    if (Math.abs(duration) < division.amount) {
      // @ts-ignore
      return formatter.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }
};

(async () => {
  try {
    const bell = document.getElementById("bell");
    const notificationBox = document.getElementById("notification-box");
    const res = await fetch("/notifications", {
      method: "GET",
    });
    if (res.redirected) {
      return (window.location.href = res.url);
    }
    const notification = await res.json();
    if (notification.status) {
      const { data } = notification;
      bell.innerText = data.length || 0;
      let template = `<div
      class="p-4 h-80 border-y border-dashed border-default-200"
      data-simplebar
    >`;
      data.map((item) => {
        template += `
                <a href="javascript:void(0);" class="flex items-center mb-4">
                  <div class="flex-grow truncate ms-2">
                    <div class="flex items-center justify-between">
                      <h5 class="text-sm font-medium text-default-800">
                        ${item.title}
                      </h5>
                      <small class="inline-flex text-xs text-default-500"
                       title="${new Date(
                         item.created_at
                       ).toLocaleString()}" >${formatTimeAgo(
          new Date(item.created_at)
        )}</small
                      >
                    </div>
                    <small class="text-default-400"
                      >${item.message}</small
                    >
                  </div>
                </a>`;
      });
      template += `</div>`;
      notificationBox.innerHTML = template;
    } else {
      alert("Error: " + notification.message);
    }
  } catch (error) {
    console.log(error);
    if (error.status) alert("Error: " + error?.message);
    else alert("Something went wrong");
  }
})();
