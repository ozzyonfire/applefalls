$( document ).ready(function() {
  createContactFooter($('#contact'));
  createContactUsSection($('#contact-us'));
});

var createContactUsSection = function(contactElement) {
  createContacts(contactElement, false);
};

var createContactFooter = function(contactElement) {
  createContacts(contactElement, true);
}

var createContacts = function (contactElement, footer) {
  if (contactElement == null || contactElement == undefined) {
    return;
  }

  var section = footer ? $('<aside>').addClass('bg-dark') : $('<section>').addClass('bg-primary');
  var container = $('<div class="container"></div>');
  var row_lg = $('<div class="row visible-lg visible-md hidden-sm hidden-xs text-center"></div>');
  var row_sm_1 = $('<div class="row hidden-lg hidden-md visible-sm hidden-xs text-center"></div>');
  var row_sm_2 = $('<div class="row hidden-lg hidden-md visible-sm hidden-xs text-center"></div>');
  var row_xs_1 = $('<div class="row hidden-lg hidden-md hidden-sm visible-xs text-center"></div>');
  var row_xs_2 = $('<div class="row hidden-lg hidden-md hidden-sm visible-xs text-center"></div>');
  var row_xs_3 = $('<div class="row hidden-lg hidden-md hidden-sm visible-xs text-center"></div>');

  // email
  var aEmail = $('<a/>');
  aEmail.attr('href', "mailto:info@applefallscider.ca");
  aEmail.addClass('alt');
  aEmail.html('info@applefallscider.ca');
  var contact_icon = createContactIcon('fa-envelope-o', 'Email', "mailto:info@applefallscider.ca", footer, aEmail);
  row_lg.append(contact_icon);
  row_sm_1.append(contact_icon.clone());
  row_xs_1.append(contact_icon.clone());

  // address
  var aAddress = $('<a/>').attr('href', 'https://goo.gl/maps/XWosM94nhnp');
  aAddress.attr('target', '_blank');
  aAddress.addClass('alt');
  aAddress.html('1633 County Rd. #3<br>Carrying Place, Ontario<br>K0K 1L0');
  contact_icon = createContactIcon('fa-address-card-o', 'Address', 'https://goo.gl/maps/XWosM94nhnp', footer, aAddress);
  row_lg.append(contact_icon);
  row_sm_1.append(contact_icon.clone());
  row_xs_1.append(contact_icon.clone());

  // phone
  var aPhone = $('<a/>');
  aPhone.attr('href', 'tel:+1-613-242-8433');
  aPhone.addClass('alt');
  aPhone.html('(613) 242-8433');
  contact_icon = createContactIcon('fa-phone', 'Phone', 'tel:+1-613-242-8433', footer, aPhone);
  row_lg.append(contact_icon);
  row_sm_1.append(contact_icon.clone());
  row_xs_2.append(contact_icon.clone());

  // facebook
  contact_icon = createContactIcon('fa-facebook', 'Facebook', 'https://www.facebook.com/applefallscider', footer);
  row_lg.append(contact_icon);
  row_sm_2.append(contact_icon.clone());
  row_xs_2.append(contact_icon.clone());

  // twitter
  contact_icon = createContactIcon('fa-twitter', 'Twitter', 'https://twitter.com/AppleFallsCider', footer);
  row_lg.append(contact_icon);
  row_sm_2.append(contact_icon.clone());
  row_xs_3.append(contact_icon.clone());

  // instagram
  contact_icon = createContactIcon('fa-instagram', 'Instagram', 'https://www.instagram.com/applefallscider/', footer);
  row_lg.append(contact_icon);
  row_sm_2.append(contact_icon.clone());
  row_xs_3.append(contact_icon.clone());

  if (!footer) {
    // create the title
    var titleRow = $('<div/>').addClass('row');
    var col = $('<div/>').addClass('col-lg-12 text-center');
    col.append('<h2 class="section-heading">Contact Us</h2>');
    col.append('<hr class="light">');

    titleRow.append(col);
    container.append(titleRow);
  }

  container.append(row_lg);
  container.append(row_sm_1);
  container.append(row_sm_2);
  container.append(row_xs_1);
  container.append(row_xs_2);
  container.append(row_xs_3);
  section.append(container);
  contactElement.append(section);
};

var createContactIcon = function(iconName, name, link, footer, a) {
  var section = $('<div class="col-lg-2 col-md-2 col-sm-4 col-xs-6"></div>');
  var serviceBox = $('<div/>').addClass('service-box');

  var aLink = $('<a/>');
  aLink.attr('href', link);
  if (!footer) {
    aLink.addClass('alt');
  }
  aLink.attr('target', '_blank');
  
  var icon = $('<i/>');
  icon.addClass('fa fa-2x wow bounceIn');
  icon.addClass(iconName);
  icon.attr('data-wow-delay', '0s');

  aLink.append(icon);
  serviceBox.append(aLink);

  if (!footer) {
    serviceBox.append('<h3>'+name+'</h3>');
    if (a != null) {
      serviceBox.append(a);
    }
  }

  section.append(serviceBox);
  return section;
};