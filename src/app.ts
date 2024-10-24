import menu from './data'
// get parent element
const sectionCenter = document.querySelector('.section-center') as HTMLElement
const btnContainer = document.querySelector('.btn-container') as HTMLElement
// display all items when page loads
window.addEventListener('DOMContentLoaded', function () {
  diplayMenuItems(menu)
  displayMenuButtons()
})

export interface MenuItem {
  id: number
  title: string
  category: string
  price: number
  img: string
  desc: string
}

function diplayMenuItems(menuItems: MenuItem) {
  let displayMenu = menuItems.map(function (item) {
    // console.log(item);

    return `<article class="menu-item">
          <img src=${item.img} alt=${item.title} class="photo" />
          <div class="item-info">
            <header>
              <h4>${item.title}</h4>
              <h4 class="price">$${item.price}</h4>
              
            </header>
            <p class="item-text">
              ${item.desc}
            </p>
          </div>
        </article>`
  })
  displayMenu = displayMenu.join('')
  // console.log(displayMenu);

  sectionCenter!.innerHTML = displayMenu
}
function displayMenuButtons() {
  const categories = menu.reduce<string[]>(
    function (values, item: MenuItem) {
      if (!values.includes(item.category)) {
        values.push(item.category)
      }
      return values
    },
    ['all']
  )
  const categoryBtns = categories
    .map(function (category) {
      return `<button type="button" class="filter-btn" data-id=${category}>
          ${category}
        </button>`
    })
    .join('')

  btnContainer.innerHTML = categoryBtns
  const filterBtns = btnContainer.querySelectorAll('.filter-btn')
  console.log(filterBtns)

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      // console.log(e.currentTarget.dataset);
      const category = e.currentTarget.dataset.id
      const menuCategory = menu.filter(function (menuItem) {
        // console.log(menuItem.category);
        if (menuItem.category === category) {
          return menuItem
        }
      })
      if (category === 'all') {
        diplayMenuItems(menu)
      } else {
        diplayMenuItems(menuCategory)
      }
    })
  })
}
