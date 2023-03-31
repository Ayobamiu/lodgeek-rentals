import { ButtonItemProps, SimpleEmailProps } from "../models";

export const generateSimpleEmail = (props: SimpleEmailProps): string => {
  const { paragraphs, buttons, title } = props;

  const ButtonItem = (i: ButtonItemProps): string =>
    `<a href="${i.link}" target="_blank" class="button" style="background-color: ${i.color};"  >${i.text}</a>`;

  const ParagraphItem = (paragraph: string): string => `<p>${paragraph}</p>`;

  const email = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title || "Lodgeek Email"}</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
          }
          h1 {
            color: blue;
          }
          p {
            line-height: inherit;
            font-size: 18px;
          }
          .button {
            text-decoration: none;
            display: inline-block;
            color: #ffffff;
            background-color: #22c55e;
            border-radius: 4px;
            padding: 10px;
            margin: 10px;
          }
          .content {
            width: 500px;
            margin-left: auto;
            margin-right: auto;
          }
          .flex {
            display: flex;
            justify-content: center;
          }
          .p-10 {
            padding: 10px;
          }
          .grey {
            color: grey;
          }
          @media (max-width: 520px) {
            .content {
              width: auto;
              padding: 18px;
            }
          }
        </style>
      </head>
      <body>
        <div class="content">
          <div class="flex p-10">
            <img
              src="https://apply-to-usman.s3.eu-west-2.amazonaws.com/logo-no-background.png"
              alt="Lodgeek Logo"
              width="100px"
            />
          </div>
          ${paragraphs.map(ParagraphItem).join(" ")}    
          <div class="flex">
          ${buttons?.length ? buttons.map(ButtonItem).join(" ") : ""}    
            
          </div>
          <div class="p-10">
            <div class="flex">
              <a href="${process.env.REACT_APP_BASE_URL}"
                ><small class="grey">Lodgeek Inc.</small></a
              >
            </div>
            <div class="flex">
              <small class="grey">Femi Coker Dr, Lekki, Lagos</small>
            </div>
          </div>
        </div>
      </body>
    </html>
    `;
  return email;
};
